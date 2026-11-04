
"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

type CopyStatus =
  | "AVAILABLE"
  | "ISSUED"
  | "LOST"
  | "DAMAGED"
  | "MAINTENANCE"
  | "REMOVED";

interface BookOption {
  id: string;
  title: string;
  author: string | null;
  category: {
    id: string;
    name: string;
  };
}

interface RackOption {
  id: string;
  rackNumber: string;
  location: string | null;
  isActive: boolean;
}

interface LibraryCopy {
  id: string;
  accessionNumber: string;
  barcode: string | null;
  status: CopyStatus;
  purchaseDate: string | null;
  purchasePrice: string | number | null;
  notes: string | null;
  book: {
    id: string;
    title: string;
    author: string | null;
    category: {
      name: string;
    };
  };
  rack: {
    id: string;
    rackNumber: string;
    location: string | null;
  } | null;
  loans: {
    id: string;
    studentId: string;
    dueAt: string;
  }[];
}

interface CopyForm {
  bookId: string;
  accessionNumber: string;
  barcode: string;
  rackId: string;
  purchaseDate: string;
  purchasePrice: string;
  notes: string;
}

const emptyForm: CopyForm = {
  bookId: "",
  accessionNumber: "",
  barcode: "",
  rackId: "",
  purchaseDate: "",
  purchasePrice: "",
  notes: "",
};

const copyStatuses: CopyStatus[] = [
  "AVAILABLE",
  "ISSUED",
  "LOST",
  "DAMAGED",
  "MAINTENANCE",
  "REMOVED",
];

async function readError(
  response: Response,
  fallback: string,
): Promise<string> {
  const data = (await response.json().catch(() => null)) as {
    error?: string;
  } | null;

  return data?.error ?? fallback;
}

export default function LibraryCopiesPage() {
  const [books, setBooks] = useState<BookOption[]>([]);
  const [racks, setRacks] = useState<RackOption[]>([]);
  const [copies, setCopies] = useState<LibraryCopy[]>([]);

  const [form, setForm] = useState<CopyForm>(emptyForm);

  const [search, setSearch] = useState("");
  const [bookFilter, setBookFilter] = useState("");
  const [rackFilter, setRackFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busyCopyId, setBusyCopyId] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadReferenceData() {
    const [bookResponse, rackResponse] = await Promise.all([
      fetch("/api/library/books?activeOnly=true", {
        cache: "no-store",
      }),
      fetch("/api/library/racks?activeOnly=true", {
        cache: "no-store",
      }),
    ]);

    if (!bookResponse.ok) {
      throw new Error(
        await readError(bookResponse, "Failed to load books."),
      );
    }

    if (!rackResponse.ok) {
      throw new Error(
        await readError(rackResponse, "Failed to load racks."),
      );
    }

    const bookData = (await bookResponse.json()) as BookOption[];
    const rackData = (await rackResponse.json()) as RackOption[];

    setBooks(bookData);
    setRacks(rackData);
  }

  async function loadCopies() {
    const params = new URLSearchParams();

    if (search.trim()) {
      params.set("search", search.trim());
    }

    if (bookFilter) {
      params.set("bookId", bookFilter);
    }

    if (rackFilter) {
      params.set("rackNumber", rackFilter);
    }

    if (statusFilter) {
      params.set("status", statusFilter);
    }

    const response = await fetch(
      `/api/library/copies?${params.toString()}`,
      { cache: "no-store" },
    );

    if (!response.ok) {
      throw new Error(
        await readError(response, "Failed to load book copies."),
      );
    }

    const data = (await response.json()) as LibraryCopy[];
    setCopies(data);
  }

  useEffect(() => {
    async function initialize() {
      try {
        setError("");

        await Promise.all([
          loadReferenceData(),
          loadCopies(),
        ]);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load library inventory.",
        );
      } finally {
        setLoading(false);
      }
    }

    void initialize();
  }, []);

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");
      await loadCopies();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to search inventory.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateCopy(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (!form.bookId) {
        throw new Error("Please select a book.");
      }

      const purchasePrice = form.purchasePrice.trim()
        ? Number(form.purchasePrice)
        : undefined;

      if (
        purchasePrice !== undefined &&
        (!Number.isFinite(purchasePrice) || purchasePrice < 0)
      ) {
        throw new Error(
          "Purchase price must be a non-negative number.",
        );
      }

      const response = await fetch("/api/library/copies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookId: form.bookId,
          accessionNumber: form.accessionNumber,
          barcode: form.barcode || undefined,
          rackId: form.rackId || undefined,
          purchaseDate: form.purchaseDate || undefined,
          purchasePrice,
          notes: form.notes || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error(
          await readError(response, "Failed to register book copy."),
        );
      }

      setForm(emptyForm);
      setSuccess("Physical book copy registered successfully.");

      await loadCopies();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to register book copy.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleRetireCopy(copy: LibraryCopy) {
    const confirmed = window.confirm(
      `Retire copy ${copy.accessionNumber}? Its inventory history will be preserved.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setBusyCopyId(copy.id);
      setError("");
      setSuccess("");

      const response = await fetch(
        `/api/library/copies/${encodeURIComponent(copy.id)}`,
        { method: "DELETE" },
      );

      if (!response.ok) {
        throw new Error(
          await readError(response, "Failed to retire book copy."),
        );
      }

      setSuccess(
        `Copy ${copy.accessionNumber} was retired successfully.`,
      );

      await loadCopies();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to retire book copy.",
      );
    } finally {
      setBusyCopyId("");
    }
  }

  async function handleMoveCopy(
    copy: LibraryCopy,
    rackId: string,
  ) {
    try {
      setBusyCopyId(copy.id);
      setError("");
      setSuccess("");

      const response = await fetch(
        `/api/library/copies/${encodeURIComponent(copy.id)}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            rackId: rackId || null,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(
          await readError(response, "Failed to update rack assignment."),
        );
      }

      setSuccess(
        `Rack assignment updated for ${copy.accessionNumber}.`,
      );

      await loadCopies();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to update rack assignment.",
      );
    } finally {
      setBusyCopyId("");
    }
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 1 }}>
        Physical Book Copies
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Register individual copies, track accession numbers, and locate
        books by rack.
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
          Register a Physical Copy
        </Typography>

        <Box
          component="form"
          onSubmit={handleCreateCopy}
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
            label="Book Title"
            value={form.bookId}
            onChange={(event) =>
              setForm({ ...form, bookId: event.target.value })
            }
            required
            fullWidth
          >
            {books.map((book) => (
              <MenuItem key={book.id} value={book.id}>
                {book.title}
                {book.author ? ` — ${book.author}` : ""}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Accession Number"
            value={form.accessionNumber}
            onChange={(event) =>
              setForm({
                ...form,
                accessionNumber: event.target.value,
              })
            }
            required
            fullWidth
          />

          <TextField
            label="Barcode (optional)"
            value={form.barcode}
            onChange={(event) =>
              setForm({ ...form, barcode: event.target.value })
            }
            fullWidth
          />

          <TextField
            select
            label="Rack"
            value={form.rackId}
            onChange={(event) =>
              setForm({ ...form, rackId: event.target.value })
            }
            fullWidth
          >
            <MenuItem value="">Unassigned</MenuItem>

            {racks.map((rack) => (
              <MenuItem key={rack.id} value={rack.id}>
                {rack.rackNumber}
                {rack.location ? ` — ${rack.location}` : ""}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Purchase Date"
            type="date"
            value={form.purchaseDate}
            onChange={(event) =>
              setForm({ ...form, purchaseDate: event.target.value })
            }
            fullWidth
          />

          <TextField
            label="Purchase Price (₹)"
            type="number"
            value={form.purchasePrice}
            onChange={(event) =>
              setForm({ ...form, purchasePrice: event.target.value })
            }
            slotProps={{
              htmlInput: {
                min: 0,
                step: 0.01,
              },
            }}
            fullWidth
          />

          <Box sx={{ gridColumn: "1 / -1" }}>
            <TextField
              label="Notes"
              value={form.notes}
              onChange={(event) =>
                setForm({ ...form, notes: event.target.value })
              }
              multiline
              minRows={2}
              fullWidth
            />
          </Box>

          <Box sx={{ gridColumn: "1 / -1" }}>
            <Button
              type="submit"
              variant="contained"
              disabled={saving || books.length === 0}
            >
              {saving ? "Registering..." : "Register Copy"}
            </Button>
          </Box>
        </Box>

        {books.length === 0 && !loading && (
          <Alert severity="info" sx={{ mt: 2 }}>
            Add a book to the catalog before registering physical copies.
          </Alert>
        )}
      </Paper>

      <Typography variant="h6" sx={{ mb: 2 }}>
        Search Inventory
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
          label="Accession, barcode, title or author"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          fullWidth
        />

        <TextField
          select
          label="Book"
          value={bookFilter}
          onChange={(event) => setBookFilter(event.target.value)}
          fullWidth
        >
          <MenuItem value="">All Books</MenuItem>

          {books.map((book) => (
            <MenuItem key={book.id} value={book.id}>
              {book.title}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Rack"
          value={rackFilter}
          onChange={(event) => setRackFilter(event.target.value)}
          fullWidth
        >
          <MenuItem value="">All Racks</MenuItem>

          {racks.map((rack) => (
            <MenuItem key={rack.id} value={rack.rackNumber}>
              {rack.rackNumber}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Status"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          fullWidth
        >
          <MenuItem value="">All Statuses</MenuItem>

          {copyStatuses.map((status) => (
            <MenuItem key={status} value={status}>
              {status.replace("_", " ")}
            </MenuItem>
          ))}
        </TextField>

        <Box sx={{ gridColumn: "1 / -1" }}>
          <Button
            type="submit"
            variant="outlined"
            disabled={loading}
          >
            Search Inventory
          </Button>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
          <CircularProgress />
        </Box>
      ) : copies.length === 0 ? (
        <Alert severity="info">
          No physical copies found. Try changing your filters.
        </Alert>
      ) : (
        <Box sx={{ display: "grid", gap: 2 }}>
          {copies.map((copy) => {
            const hasActiveLoan = copy.loans.length > 0;

            return (
              <Paper key={copy.id} variant="outlined" sx={{ p: 2.5 }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: {
                      xs: "column",
                      md: "row",
                    },
                    justifyContent: "space-between",
                    gap: 2,
                  }}
                >
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography variant="h6">
                      {copy.book.title}
                    </Typography>

                    <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                      Accession: {copy.accessionNumber}
                    </Typography>

                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Author: {copy.book.author || "Unknown"}
                    </Typography>

                    <Typography variant="body2">
                      Category: {copy.book.category.name}
                    </Typography>

                    <Typography variant="body2">
                      Barcode: {copy.barcode || "Not assigned"}
                    </Typography>

                    <Typography variant="body2">
                      Purchase price:{" "}
                      {copy.purchasePrice == null
                        ? "Not recorded"
                        : new Intl.NumberFormat("en-IN", {
                            style: "currency",
                            currency: "INR",
                          }).format(Number(copy.purchasePrice))}
                    </Typography>

                    {copy.notes && (
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Notes: {copy.notes}
                      </Typography>
                    )}
                  </Box>

                  <Box
                    sx={{
                      width: {
                        xs: "100%",
                        md: 230,
                      },
                      display: "grid",
                      alignContent: "start",
                      gap: 1.5,
                    }}
                  >
                    <Typography variant="body2">
                      Status: <strong>{copy.status}</strong>
                    </Typography>

                    <Typography variant="body2">
                      Current rack:{" "}
                      {copy.rack?.rackNumber || "Unassigned"}
                    </Typography>

                    {copy.status !== "ISSUED" &&
                      copy.status !== "LOST" &&
                      copy.status !== "REMOVED" && (
                        <TextField
                          select
                          size="small"
                          label="Move to Rack"
                          value={copy.rack?.id || ""}
                          disabled={busyCopyId === copy.id}
                          onChange={(event) =>
                            void handleMoveCopy(copy, event.target.value)
                          }
                          fullWidth
                        >
                          <MenuItem value="">Unassigned</MenuItem>

                          {racks.map((rack) => (
                            <MenuItem key={rack.id} value={rack.id}>
                              {rack.rackNumber}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}

                    {copy.status !== "REMOVED" &&
                      copy.status !== "LOST" && (
                        <Button
                          color="error"
                          variant="outlined"
                          disabled={
                            busyCopyId === copy.id ||
                            hasActiveLoan ||
                            copy.status === "ISSUED"
                          }
                          onClick={() => void handleRetireCopy(copy)}
                        >
                          {busyCopyId === copy.id
                            ? "Processing..."
                            : "Retire Copy"}
                        </Button>
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
