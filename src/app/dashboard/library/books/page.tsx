
"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Divider,
    MenuItem,
    Paper,
    TextField,
    Typography,
} from "@mui/material";

interface LibraryCategory {
    id: string;
    name: string;
    isActive: boolean;
}

interface LibraryBook {
    id: string;
    title: string;
    author: string | null;
    publisher: string | null;
    isbn: string | null;
    edition: string | null;
    publicationYear: number | null;
    language: string | null;
    description: string | null;
    isActive: boolean;
    category: {
        id: string;
        name: string;
    };
    totalCopies?: number;
    availableCopies?: number;
    _count?: {
        copies: number;
    };
}

interface BookForm {
    title: string;
    categoryId: string;
    author: string;
    publisher: string;
    isbn: string;
    edition: string;
    publicationYear: string;
    language: string;
    description: string;
}

const emptyForm: BookForm = {
    title: "",
    categoryId: "",
    author: "",
    publisher: "",
    isbn: "",
    edition: "",
    publicationYear: "",
    language: "",
    description: "",
};

export default function LibraryBooksPage() {
    const [books, setBooks] = useState<LibraryBook[]>([]);
    const [categories, setCategories] = useState<LibraryCategory[]>([]);

    const [form, setForm] = useState<BookForm>(emptyForm);

    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [rackNumber, setRackNumber] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    async function loadCategories() {
        const response = await fetch(
            "/api/library/categories?activeOnly=true",
            { cache: "no-store" },
        );

        const data = (await response.json()) as
            | LibraryCategory[]
            | { error?: string };

        if (!response.ok || !Array.isArray(data)) {
            throw new Error(
                !Array.isArray(data)
                    ? data.error ?? "Failed to load categories."
                    : "Failed to load categories.",
            );
        }

        setCategories(data);
    }

    async function loadBooks() {
        const params = new URLSearchParams({
            activeOnly: "true",
        });

        if (search.trim()) {
            params.set("search", search.trim());
        }

        if (categoryFilter) {
            params.set("categoryId", categoryFilter);
        }

        if (rackNumber.trim()) {
            params.set("rackNumber", rackNumber.trim());
        }

        const response = await fetch(
            `/api/library/books?${params.toString()}`,
            { cache: "no-store" },
        );

        const data = (await response.json()) as
            | LibraryBook[]
            | { error?: string };

        if (!response.ok || !Array.isArray(data)) {
            throw new Error(
                !Array.isArray(data)
                    ? data.error ?? "Failed to load books."
                    : "Failed to load books.",
            );
        }

        setBooks(data);
    }

    useEffect(() => {
        async function initialize() {
            try {
                setError("");
                await Promise.all([loadCategories(), loadBooks()]);
            } catch (error) {
                setError(
                    error instanceof Error
                        ? error.message
                        : "Failed to load the book catalog.",
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
            await loadBooks();
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to search books.",
            );
        } finally {
            setLoading(false);
        }
    }

    async function handleCreateBook(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        try {
            setSaving(true);
            setError("");
            setSuccess("");

            if (!form.categoryId) {
                throw new Error("Please select a book category.");
            }

            const publicationYear = form.publicationYear.trim()
                ? Number(form.publicationYear)
                : undefined;

            if (
                publicationYear !== undefined &&
                !Number.isInteger(publicationYear)
            ) {
                throw new Error("Publication year must be a whole number.");
            }

            const response = await fetch("/api/library/books", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: form.title,
                    categoryId: form.categoryId,
                    author: form.author,
                    publisher: form.publisher,
                    isbn: form.isbn,
                    edition: form.edition,
                    publicationYear,
                    language: form.language,
                    description: form.description,
                }),
            });

            const result = (await response.json()) as
                | LibraryBook
                | { error?: string };

            if (!response.ok) {
                throw new Error(
                    "error" in result
                        ? result.error ?? "Failed to create book."
                        : "Failed to create book.",
                );
            }

            setForm(emptyForm);
            setSuccess("Book added to the catalog successfully.");

            await loadBooks();
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to create book.",
            );
        } finally {
            setSaving(false);
        }
    }

    return (
        <Box>
            <Typography variant="h4" sx={{ mb: 1 }}>
                Book Catalog
            </Typography>

            <Typography color="text.secondary" sx={{ mb: 3 }}>
                Manage book information and find books by title, category, or rack.
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
                    Add a Book
                </Typography>

                <Box
                    component="form"
                    onSubmit={handleCreateBook}
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
                        label="Book Title"
                        value={form.title}
                        onChange={(event) =>
                            setForm({ ...form, title: event.target.value })
                        }
                        required
                        fullWidth
                    />

                    <TextField
                        select
                        label="Category"
                        value={form.categoryId}
                        onChange={(event) =>
                            setForm({ ...form, categoryId: event.target.value })
                        }
                        required
                        fullWidth
                    >
                        {categories.map((category) => (
                            <MenuItem key={category.id} value={category.id}>
                                {category.name}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        label="Author"
                        value={form.author}
                        onChange={(event) =>
                            setForm({ ...form, author: event.target.value })
                        }
                        fullWidth
                    />

                    <TextField
                        label="Publisher"
                        value={form.publisher}
                        onChange={(event) =>
                            setForm({ ...form, publisher: event.target.value })
                        }
                        fullWidth
                    />

                    <TextField
                        label="ISBN"
                        value={form.isbn}
                        onChange={(event) =>
                            setForm({ ...form, isbn: event.target.value })
                        }
                        fullWidth
                    />

                    <TextField
                        label="Edition"
                        value={form.edition}
                        onChange={(event) =>
                            setForm({ ...form, edition: event.target.value })
                        }
                        fullWidth
                    />

                    <TextField
                        label="Publication Year"
                        type="number"
                        value={form.publicationYear}
                        onChange={(event) =>
                            setForm({
                                ...form,
                                publicationYear: event.target.value,
                            })
                        }
                        slotProps={{
                            htmlInput: {
                                min: 1,
                                max: new Date().getFullYear(),
                            },
                        }}
                        fullWidth
                    />

                    <TextField
                        label="Language"
                        value={form.language}
                        onChange={(event) =>
                            setForm({ ...form, language: event.target.value })
                        }
                        fullWidth
                    />

                    <Box sx={{ gridColumn: "1 / -1" }}>
                        <TextField
                            label="Description"
                            value={form.description}
                            onChange={(event) =>
                                setForm({ ...form, description: event.target.value })
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
                            disabled={saving || categories.length === 0}
                        >
                            {saving ? "Saving..." : "Add Book"}
                        </Button>
                    </Box>
                </Box>

                {categories.length === 0 && !loading && (
                    <Alert severity="info" sx={{ mt: 2 }}>
                        Create an active category before adding a book.
                    </Alert>
                )}
            </Paper>

            <Divider sx={{ mb: 3 }} />

            <Typography variant="h6" sx={{ mb: 2 }}>
                Search Catalog
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
                    label="Title, author, ISBN, or accession number"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    fullWidth
                />

                <TextField
                    select
                    label="Filter by Category"
                    value={categoryFilter}
                    onChange={(event) => setCategoryFilter(event.target.value)}
                    fullWidth
                >
                    <MenuItem value="">All Categories</MenuItem>
                    {categories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                            {category.name}
                        </MenuItem>
                    ))}
                </TextField>

                <TextField
                    label="Rack Number"
                    value={rackNumber}
                    onChange={(event) => setRackNumber(event.target.value)}
                    fullWidth
                />

                <Button
                    type="submit"
                    variant="outlined"
                    disabled={loading}
                >
                    Search Books
                </Button>
            </Box>

            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
                    <CircularProgress />
                </Box>
            ) : books.length === 0 ? (
                <Alert severity="info">
                    No books found. Try changing the search or filters.
                </Alert>
            ) : (
                <Box sx={{ display: "grid", gap: 2 }}>
                    {books.map((book) => (
                        <Paper
                            key={book.id}
                            variant="outlined"
                            sx={{ p: 2.5 }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: { xs: "column", sm: "row" },
                                    justifyContent: "space-between",
                                    gap: 2,
                                }}
                            >
                                <Box sx={{ minWidth: 0 }}>
                                    <Typography variant="h6">
                                        {book.title}
                                    </Typography>

                                    <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                                        {book.author || "Unknown author"}
                                        {book.edition ? ` · ${book.edition}` : ""}
                                    </Typography>

                                    <Typography variant="body2" sx={{ mt: 1 }}>
                                        Category: {book.category.name}
                                    </Typography>

                                    {book.isbn && (
                                        <Typography variant="body2">
                                            ISBN: {book.isbn}
                                        </Typography>
                                    )}

                                    {book.publisher && (
                                        <Typography variant="body2">
                                            Publisher: {book.publisher}
                                        </Typography>
                                    )}
                                </Box>

                                <Box
                                    sx={{
                                        minWidth: 140,
                                        alignSelf: { xs: "flex-start", sm: "center" },
                                    }}
                                >
                                    <Typography variant="body2">
                                        Total copies:{" "}
                                        {book.totalCopies ?? book._count?.copies ?? 0}
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        sx={{ mt: 0.5 }}
                                    >
                                        Available: {book.availableCopies ?? 0}
                                    </Typography>
                                </Box>
                            </Box>
                        </Paper>
                    ))}
                </Box>
            )}
        </Box>
    );
}
