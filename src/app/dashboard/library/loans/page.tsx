
"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import {
    Alert,
    Box,
    Button,
    Chip,
    CircularProgress,
    Divider,
    MenuItem,
    Paper,
    TextField,
    Typography,
} from "@mui/material";

type LoanStatus = "ACTIVE" | "RETURNED" | "LOST";
type CopyStatus =
    | "AVAILABLE"
    | "ISSUED"
    | "LOST"
    | "DAMAGED"
    | "MAINTENANCE"
    | "REMOVED";
type PaymentType = "FINE" | "REPLACEMENT";
type PaymentMethod =
    | "CASH"
    | "UPI"
    | "BANK_TRANSFER"
    | "CARD"
    | "OTHER";

interface AvailableCopy {
    id: string;
    accessionNumber: string;
    barcode: string | null;
    status: CopyStatus;
    book: {
        title: string;
        author: string | null;
        category: {
            name: string;
        };
    };
    rack: {
        rackNumber: string;
    } | null;
}

interface LibraryLoan {
    id: string;
    status: LoanStatus;
    issuedAt: string;
    dueAt: string;
    returnedAt: string | null;
    renewalCount: number;
    fineAmount: string | number;
    finePaidAmount: string | number;
    replacementCharge: string | number;
    replacementPaidAmount: string | number;
    student: {
        id: string;
        admissionNumber: string;
        firstName: string;
        lastName: string;
        section: {
            name: string;
            class: {
                name: string;
            };
        } | null;
    };
    bookCopy: {
        id: string;
        accessionNumber: string;
        barcode: string | null;
        status: CopyStatus;
        book: {
            title: string;
            author: string | null;
            category: {
                name: string;
            };
        };
        rack: {
            rackNumber: string;
        } | null;
    };
    issuedByUser: {
        id: string;
        name: string;
    };
    returnedByUser: {
        id: string;
        name: string;
    } | null;
    payments: {
        id: string;
        type: PaymentType;
        amount: string | number;
        method: PaymentMethod;
        reference: string | null;
        notes: string | null;
        receivedAt: string;
        receivedBy: {
            id: string;
            name: string;
        };
    }[];
}

const paymentMethods: PaymentMethod[] = [
    "CASH",
    "UPI",
    "BANK_TRANSFER",
    "CARD",
    "OTHER",
];

const loanStatuses: LoanStatus[] = [
    "ACTIVE",
    "RETURNED",
    "LOST",
];

async function responseError(
    response: Response,
    fallback: string,
): Promise<string> {
    const data = (await response.json().catch(() => null)) as {
        error?: string;
    } | null;

    return data?.error ?? fallback;
}

function money(value: string | number) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
    }).format(Number(value));
}

function isOverdue(loan: LibraryLoan) {
    return (
        loan.status === "ACTIVE" &&
        new Date(loan.dueAt).getTime() < Date.now()
    );
}

function outstanding(
    charged: string | number,
    paid: string | number,
) {
    return Math.max(0, Number(charged) - Number(paid));
}

export default function LibraryLoansPage() {
    const [copies, setCopies] = useState<AvailableCopy[]>([]);
    const [loans, setLoans] = useState<LibraryLoan[]>([]);

    const [studentId, setStudentId] = useState("");
    const [bookCopyId, setBookCopyId] = useState("");

    const [search, setSearch] = useState("");
    const [studentFilter, setStudentFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState<LoanStatus | "ACTIVE_ONLY">(
        "ACTIVE_ONLY",
    );
    const [overdueOnly, setOverdueOnly] = useState(false);

    const [paymentLoanId, setPaymentLoanId] = useState("");
    const [paymentType, setPaymentType] = useState<PaymentType>("FINE");
    const [paymentAmount, setPaymentAmount] = useState("");
    const [paymentMethod, setPaymentMethod] =
        useState<PaymentMethod>("CASH");
    const [paymentReference, setPaymentReference] = useState("");
    const [paymentNotes, setPaymentNotes] = useState("");

    const [loading, setLoading] = useState(true);
    const [issuing, setIssuing] = useState(false);
    const [busyLoanId, setBusyLoanId] = useState("");
    const [recordingPayment, setRecordingPayment] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    async function loadCopies() {
        const response = await fetch(
            "/api/library/copies?status=AVAILABLE",
            { cache: "no-store" },
        );

        if (!response.ok) {
            throw new Error(
                await responseError(response, "Failed to load available copies."),
            );
        }

        const data = (await response.json()) as AvailableCopy[];
        setCopies(data);
    }

    async function loadLoans() {
        const params = new URLSearchParams();

        if (statusFilter !== "ACTIVE_ONLY") {
            params.set("status", statusFilter);
        } else {
            params.set("status", "ACTIVE");
        }

        if (overdueOnly) {
            params.set("overdueOnly", "true");
        }

        if (search.trim()) {
            params.set("search", search.trim());
        }

        if (studentFilter.trim()) {
            params.set("studentId", studentFilter.trim());
        }

        const response = await fetch(
            `/api/library/loans?${params.toString()}`,
            { cache: "no-store" },
        );

        if (!response.ok) {
            throw new Error(
                await responseError(response, "Failed to load library loans."),
            );
        }

        const data = (await response.json()) as LibraryLoan[];
        setLoans(data);
    }

    async function refreshData() {
        await Promise.all([loadCopies(), loadLoans()]);
    }

    useEffect(() => {
        async function initialize() {
            try {
                await refreshData();
            } catch (error) {
                setError(
                    error instanceof Error
                        ? error.message
                        : "Failed to load circulation data.",
                );
            } finally {
                setLoading(false);
            }
        }

        void initialize();
    }, []);

    async function handleIssue(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        try {
            setIssuing(true);
            setError("");
            setSuccess("");

            if (!studentId.trim() || !bookCopyId) {
                throw new Error("Enter a student ID and select a book copy.");
            }

            const response = await fetch("/api/library/loans", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    studentId: studentId.trim(),
                    bookCopyId,
                }),
            });

            if (!response.ok) {
                throw new Error(
                    await responseError(response, "Failed to issue book."),
                );
            }

            setStudentId("");
            setBookCopyId("");
            setSuccess("Book issued successfully.");

            await refreshData();
        } catch (error) {
            setError(
                error instanceof Error ? error.message : "Failed to issue book.",
            );
        } finally {
            setIssuing(false);
        }
    }

    async function handleSearch(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        try {
            setLoading(true);
            setError("");
            await loadLoans();
        } catch (error) {
            setError(
                error instanceof Error ? error.message : "Failed to search loans.",
            );
        } finally {
            setLoading(false);
        }
    }

    async function performLoanAction(
        loan: LibraryLoan,
        action: "return" | "renew" | "condition",
        condition?: "LOST" | "DAMAGED",
    ) {
        const actionMessage = {
            return: "Return this book?",
            renew: "Renew this book?",
            condition:
                condition === "LOST"
                    ? "Mark this book as lost?"
                    : "Mark this book as damaged?",
        }[action];

        if (!window.confirm(actionMessage)) {
            return;
        }

        try {
            setBusyLoanId(loan.id);
            setError("");
            setSuccess("");

            const url =
                action === "condition"
                    ? `/api/library/loans/${encodeURIComponent(loan.id)}/condition`
                    : `/api/library/loans/${encodeURIComponent(loan.id)}/${action}`;

            const response = await fetch(url, {
                method: "POST",
                headers:
                    action === "condition"
                        ? { "Content-Type": "application/json" }
                        : undefined,
                body:
                    action === "condition"
                        ? JSON.stringify({ condition })
                        : undefined,
            });

            if (!response.ok) {
                throw new Error(
                    await responseError(response, `Failed to ${action} book.`),
                );
            }

            const messages = {
                return: "Book returned successfully.",
                renew: "Book renewed successfully.",
                condition:
                    condition === "LOST"
                        ? "Book marked as lost."
                        : "Book marked as damaged.",
            };

            setSuccess(messages[action]);
            await refreshData();
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : `Failed to ${action} book.`,
            );
        } finally {
            setBusyLoanId("");
        }
    }

    function startPayment(loan: LibraryLoan, type: PaymentType) {
        setPaymentLoanId(loan.id);
        setPaymentType(type);
        setPaymentAmount("");
        setPaymentMethod("CASH");
        setPaymentReference("");
        setPaymentNotes("");
        setError("");
        setSuccess("");
    }

    async function handlePayment(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        try {
            setRecordingPayment(true);
            setError("");
            setSuccess("");

            const amount = Number(paymentAmount);

            if (!Number.isFinite(amount) || amount <= 0) {
                throw new Error("Enter a valid positive payment amount.");
            }

            const response = await fetch("/api/library/payments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    loanId: paymentLoanId,
                    type: paymentType,
                    amount,
                    method: paymentMethod,
                    reference: paymentReference || undefined,
                    notes: paymentNotes || undefined,
                }),
            });

            if (!response.ok) {
                throw new Error(
                    await responseError(response, "Failed to record payment."),
                );
            }

            setPaymentLoanId("");
            setPaymentAmount("");
            setPaymentReference("");
            setPaymentNotes("");
            setSuccess("Payment recorded successfully.");

            await refreshData();
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to record payment.",
            );
        } finally {
            setRecordingPayment(false);
        }
    }

    const visibleLoans = loans;

    return (
        <Box>
            <Typography variant="h4" sx={{ mb: 1 }}>
                Loans & Circulation
            </Typography>

            <Typography color="text.secondary" sx={{ mb: 3 }}>
                Issue books, manage returns and renewals, track overdue loans,
                and record fine or replacement payments.
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    {success}
                </Alert>
            )}

            <Paper variant="outlined" sx={{ p: 3, mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                    Issue a Book
                </Typography>

                <Box
                    component="form"
                    onSubmit={handleIssue}
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            md: "repeat(2, minmax(0, 1fr))",
                        },
                        gap: 2,
                    }}
                >
                    <TextField
                        label="Student ID"
                        value={studentId}
                        onChange={(event) => setStudentId(event.target.value)}
                        helperText="Enter the student's record ID."
                        required
                        fullWidth
                    />

                    <TextField
                        select
                        label="Available Book Copy"
                        value={bookCopyId}
                        onChange={(event) => setBookCopyId(event.target.value)}
                        required
                        fullWidth
                    >
                        {copies.map((copy) => (
                            <MenuItem key={copy.id} value={copy.id}>
                                {copy.book.title} — {copy.accessionNumber}
                                {copy.rack ? ` · Rack ${copy.rack.rackNumber}` : ""}
                            </MenuItem>
                        ))}
                    </TextField>

                    <Box sx={{ gridColumn: "1 / -1" }}>
                        <Button
                            variant="contained"
                            type="submit"
                            disabled={issuing || copies.length === 0}
                        >
                            {issuing ? "Issuing..." : "Issue Book"}
                        </Button>

                        {copies.length === 0 && !loading && (
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mt: 1 }}
                            >
                                No available copies to issue.
                            </Typography>
                        )}
                    </Box>
                </Box>
            </Paper>

            <Typography variant="h6" sx={{ mb: 2 }}>
                Find Loans
            </Typography>

            <Box
                component="form"
                onSubmit={handleSearch}
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(2, minmax(0, 1fr))",
                        lg: "repeat(4, minmax(0, 1fr))",
                    },
                    gap: 2,
                    mb: 3,
                }}
            >
                <TextField
                    label="Search student or book"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    fullWidth
                />

                <TextField
                    label="Student ID (optional)"
                    value={studentFilter}
                    onChange={(event) => setStudentFilter(event.target.value)}
                    fullWidth
                />

                <TextField
                    select
                    label="Loan Status"
                    value={statusFilter}
                    onChange={(event) =>
                        setStatusFilter(event.target.value as LoanStatus | "ACTIVE_ONLY")
                    }
                    fullWidth
                >
                    <MenuItem value="ACTIVE_ONLY">Active Loans</MenuItem>
                    {loanStatuses.map((status) => (
                        <MenuItem key={status} value={status}>
                            {status}
                        </MenuItem>
                    ))}
                </TextField>

                <TextField
                    select
                    label="Overdue"
                    value={overdueOnly ? "YES" : "ALL"}
                    onChange={(event) => setOverdueOnly(event.target.value === "YES")}
                    fullWidth
                >
                    <MenuItem value="ALL">All matching loans</MenuItem>
                    <MenuItem value="YES">Overdue only</MenuItem>
                </TextField>

                <Box sx={{ gridColumn: "1 / -1" }}>
                    <Button type="submit" variant="outlined" disabled={loading}>
                        Search Loans
                    </Button>
                </Box>
            </Box>

            {paymentLoanId && (
                <Paper variant="outlined" sx={{ p: 3, mb: 4 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Record {paymentType === "FINE" ? "Fine" : "Replacement"} Payment
                    </Typography>

                    <Box
                        component="form"
                        onSubmit={handlePayment}
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                sm: "repeat(2, minmax(0, 1fr))",
                            },
                            gap: 2,
                        }}
                    >
                        <TextField
                            select
                            label="Payment Type"
                            value={paymentType}
                            onChange={(event) =>
                                setPaymentType(event.target.value as PaymentType)
                            }
                            fullWidth
                        >
                            <MenuItem value="FINE">Fine</MenuItem>
                            <MenuItem value="REPLACEMENT">Replacement charge</MenuItem>
                        </TextField>

                        <TextField
                            label="Amount (₹)"
                            type="number"
                            value={paymentAmount}
                            onChange={(event) => setPaymentAmount(event.target.value)}
                            required
                            slotProps={{
                                htmlInput: {
                                    min: 0.01,
                                    step: 0.01,
                                },
                            }}
                            fullWidth
                        />

                        <TextField
                            select
                            label="Payment Method"
                            value={paymentMethod}
                            onChange={(event) =>
                                setPaymentMethod(event.target.value as PaymentMethod)
                            }
                            fullWidth
                        >
                            {paymentMethods.map((method) => (
                                <MenuItem key={method} value={method}>
                                    {method.replace("_", " ")}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            label="Transaction Reference (optional)"
                            value={paymentReference}
                            onChange={(event) =>
                                setPaymentReference(event.target.value)
                            }
                            fullWidth
                        />

                        <Box sx={{ gridColumn: "1 / -1" }}>
                            <TextField
                                label="Notes (optional)"
                                value={paymentNotes}
                                onChange={(event) => setPaymentNotes(event.target.value)}
                                fullWidth
                                multiline
                                minRows={2}
                            />
                        </Box>

                        <Box
                            sx={{
                                gridColumn: "1 / -1",
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 1.5,
                            }}
                        >
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={recordingPayment}
                            >
                                {recordingPayment ? "Recording..." : "Record Payment"}
                            </Button>

                            <Button
                                type="button"
                                variant="outlined"
                                onClick={() => setPaymentLoanId("")}
                                disabled={recordingPayment}
                            >
                                Cancel
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            )}

            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
                    <CircularProgress />
                </Box>
            ) : visibleLoans.length === 0 ? (
                <Alert severity="info">
                    No loans found. Change the filters or issue a book to begin.
                </Alert>
            ) : (
                <Box sx={{ display: "grid", gap: 2 }}>
                    {visibleLoans.map((loan) => {
                        const overdue = isOverdue(loan);
                        const fineBalance = outstanding(
                            loan.fineAmount,
                            loan.finePaidAmount,
                        );
                        const replacementBalance = outstanding(
                            loan.replacementCharge,
                            loan.replacementPaidAmount,
                        );

                        return (
                            <Paper
                                key={loan.id}
                                variant="outlined"
                                sx={{ p: 2.5 }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: { xs: "column", lg: "row" },
                                        justifyContent: "space-between",
                                        gap: 3,
                                    }}
                                >
                                    <Box sx={{ minWidth: 0, flex: 1 }}>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                flexWrap: "wrap",
                                                alignItems: "center",
                                                gap: 1,
                                                mb: 1,
                                            }}
                                        >
                                            <Typography variant="h6">
                                                {loan.bookCopy.book.title}
                                            </Typography>

                                            <Chip
                                                size="small"
                                                label={loan.status}
                                                color={
                                                    loan.status === "ACTIVE"
                                                        ? overdue
                                                            ? "error"
                                                            : "primary"
                                                        : loan.status === "LOST"
                                                            ? "error"
                                                            : "default"
                                                }
                                                variant="outlined"
                                            />

                                            {overdue && (
                                                <Chip
                                                    size="small"
                                                    color="error"
                                                    label="OVERDUE"
                                                />
                                            )}
                                        </Box>

                                        <Typography variant="body2">
                                            Student: {loan.student.firstName}{" "}
                                            {loan.student.lastName} (
                                            {loan.student.admissionNumber})
                                        </Typography>

                                        <Typography variant="body2">
                                            Accession: {loan.bookCopy.accessionNumber}
                                            {" · "}
                                            Category: {loan.bookCopy.book.category.name}
                                        </Typography>

                                        <Typography variant="body2">
                                            Issued: {new Date(loan.issuedAt).toLocaleDateString("en-IN")}
                                            {" · "}
                                            Due: {new Date(loan.dueAt).toLocaleDateString("en-IN")}
                                        </Typography>

                                        <Typography variant="body2">
                                            Issued by: {loan.issuedByUser.name}
                                        </Typography>

                                        {loan.returnedAt && (
                                            <Typography variant="body2">
                                                Returned:{" "}
                                                {new Date(loan.returnedAt).toLocaleDateString("en-IN")}
                                                {loan.returnedByUser
                                                    ? ` · Processed by ${loan.returnedByUser.name}`
                                                    : ""}
                                            </Typography>
                                        )}

                                        <Divider sx={{ my: 2 }} />

                                        <Typography variant="subtitle2">
                                            Charges & Payments
                                        </Typography>

                                        <Typography variant="body2">
                                            Fine: {money(loan.fineAmount)} charged ·{" "}
                                            {money(loan.finePaidAmount)} paid ·{" "}
                                            {money(fineBalance)} outstanding
                                        </Typography>

                                        <Typography variant="body2">
                                            Replacement: {money(loan.replacementCharge)} charged ·{" "}
                                            {money(loan.replacementPaidAmount)} paid ·{" "}
                                            {money(replacementBalance)} outstanding
                                        </Typography>

                                        {loan.payments.length > 0 && (
                                            <Box sx={{ mt: 2 }}>
                                                <Typography variant="subtitle2">
                                                    Payment History
                                                </Typography>

                                                {loan.payments.map((payment) => (
                                                    <Typography
                                                        key={payment.id}
                                                        variant="body2"
                                                        color="text.secondary"
                                                        sx={{ mt: 0.5 }}
                                                    >
                                                        {new Date(payment.receivedAt).toLocaleDateString("en-IN")}
                                                        {" · "}
                                                        {payment.type}
                                                        {" · "}
                                                        {money(payment.amount)}
                                                        {" · "}
                                                        {payment.method.replace("_", " ")}
                                                        {" · Received by "}
                                                        {payment.receivedBy.name}
                                                        {payment.reference
                                                            ? ` · Ref: ${payment.reference}`
                                                            : ""}
                                                    </Typography>
                                                ))}
                                            </Box>
                                        )}
                                    </Box>

                                    <Box
                                        sx={{
                                            width: { xs: "100%", lg: 210 },
                                            display: "grid",
                                            alignContent: "start",
                                            gap: 1,
                                        }}
                                    >
                                        {loan.status === "ACTIVE" && (
                                            <>
                                                <Button
                                                    variant="contained"
                                                    disabled={busyLoanId === loan.id}
                                                    onClick={() =>
                                                        void performLoanAction(loan, "return")
                                                    }
                                                >
                                                    Return Book
                                                </Button>

                                                <Button
                                                    variant="outlined"
                                                    disabled={busyLoanId === loan.id || overdue}
                                                    onClick={() =>
                                                        void performLoanAction(loan, "renew")
                                                    }
                                                >
                                                    Renew Book
                                                </Button>

                                                <Button
                                                    color="warning"
                                                    variant="outlined"
                                                    disabled={busyLoanId === loan.id}
                                                    onClick={() =>
                                                        void performLoanAction(
                                                            loan,
                                                            "condition",
                                                            "LOST",
                                                        )
                                                    }
                                                >
                                                    Mark Lost
                                                </Button>

                                                <Button
                                                    color="warning"
                                                    variant="outlined"
                                                    disabled={busyLoanId === loan.id}
                                                    onClick={() =>
                                                        void performLoanAction(
                                                            loan,
                                                            "condition",
                                                            "DAMAGED",
                                                        )
                                                    }
                                                >
                                                    Mark Damaged
                                                </Button>
                                            </>
                                        )}

                                        {fineBalance > 0 && (
                                            <Button
                                                variant="outlined"
                                                onClick={() => startPayment(loan, "FINE")}
                                            >
                                                Pay Fine
                                            </Button>
                                        )}

                                        {replacementBalance > 0 && (
                                            <Button
                                                variant="outlined"
                                                onClick={() => startPayment(loan, "REPLACEMENT")}
                                            >
                                                Pay Replacement
                                            </Button>
                                        )}

                                        {busyLoanId === loan.id && (
                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                                sx={{ textAlign: "center" }}
                                            >
                                                Processing...
                                            </Typography>
                                        )}
                                    </Box>
                                </Box>
                            </Paper>
                        );
                    })}
                </Box>
            )}
        </Box>
    );
}
