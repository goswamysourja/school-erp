
"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

interface LibraryCategory {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CategoryForm {
  name: string;
  description: string;
}

const emptyForm: CategoryForm = {
  name: "",
  description: "",
};

async function getErrorMessage(
  response: Response,
  fallback: string,
) {
  const data = (await response.json().catch(() => null)) as {
    error?: string;
  } | null;

  return data?.error ?? fallback;
}

export default function LibraryCategoriesPage() {
  const [categories, setCategories] = useState<LibraryCategory[]>([]);
  const [form, setForm] = useState<CategoryForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadCategories() {
    const response = await fetch("/api/library/categories", {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(
        await getErrorMessage(
          response,
          "Failed to load library categories.",
        ),
      );
    }

    const data = (await response.json()) as LibraryCategory[];
    setCategories(data);
  }

  useEffect(() => {
    async function initialize() {
      try {
        setError("");
        await loadCategories();
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load library categories.",
        );
      } finally {
        setLoading(false);
      }
    }

    void initialize();
  }, []);

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  function startEditing(category: LibraryCategory) {
    setEditingId(category.id);
    setForm({
      name: category.name,
      description: category.description ?? "",
    });
    setError("");
    setSuccess("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const isEditing = editingId !== null;

      const response = await fetch(
        isEditing
          ? `/api/library/categories/${encodeURIComponent(editingId)}`
          : "/api/library/categories",
        {
          method: isEditing ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name.trim(),
            description: form.description.trim(),
          }),
        },
      );

      if (!response.ok) {
        throw new Error(
          await getErrorMessage(
            response,
            isEditing
              ? "Failed to update category."
              : "Failed to create category.",
          ),
        );
      }

      setSuccess(
        isEditing
          ? "Category updated successfully."
          : "Category created successfully.",
      );

      resetForm();
      await loadCategories();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to save category.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDeactivate(category: LibraryCategory) {
    const confirmed = window.confirm(
      `Deactivate "${category.name}"? Existing books will retain their category association.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setBusyId(category.id);
      setError("");
      setSuccess("");

      const response = await fetch(
        `/api/library/categories/${encodeURIComponent(category.id)}`,
        { method: "DELETE" },
      );

      if (!response.ok) {
        throw new Error(
          await getErrorMessage(
            response,
            "Failed to deactivate category.",
          ),
        );
      }

      if (editingId === category.id) {
        resetForm();
      }

      setSuccess(`"${category.name}" was deactivated.`);
      await loadCategories();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to deactivate category.",
      );
    } finally {
      setBusyId("");
    }
  }

  const filteredCategories = categories.filter((category) => {
    const query = search.trim().toLowerCase();

    return (
      !query ||
      category.name.toLowerCase().includes(query) ||
      (category.description ?? "").toLowerCase().includes(query)
    );
  });

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 1 }}>
        Library Categories
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Organize the book catalog into categories such as Science,
        Mathematics, History, Fiction and Reference.
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
          {editingId ? "Edit Category" : "Create Category"}
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
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
            label="Category Name"
            value={form.name}
            onChange={(event) =>
              setForm({ ...form, name: event.target.value })
            }
            required
            fullWidth
          />

          <TextField
            label="Description"
            value={form.description}
            onChange={(event) =>
              setForm({
                ...form,
                description: event.target.value,
              })
            }
            multiline
            minRows={1}
            maxRows={3}
            fullWidth
          />

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
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Save Changes"
                  : "Create Category"}
            </Button>

            {editingId && (
              <Button
                type="button"
                variant="outlined"
                disabled={saving}
                onClick={resetForm}
              >
                Cancel Edit
              </Button>
            )}
          </Box>
        </Box>
      </Paper>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
          gap: 2,
          mb: 2,
        }}
      >
        <Typography variant="h6">
          Categories ({filteredCategories.length})
        </Typography>

        <TextField
          size="small"
          label="Search categories"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          sx={{ width: { xs: "100%", sm: 280 } }}
        />
      </Box>

      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            py: 5,
          }}
        >
          <CircularProgress />
        </Box>
      ) : filteredCategories.length === 0 ? (
        <Alert severity="info">
          No categories found. Create a category or change your search.
        </Alert>
      ) : (
        <Box sx={{ display: "grid", gap: 2 }}>
          {filteredCategories.map((category) => (
            <Paper
              key={category.id}
              variant="outlined"
              sx={{ p: 2.5 }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  justifyContent: "space-between",
                  alignItems: { xs: "stretch", sm: "center" },
                  gap: 2,
                }}
              >
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: 1,
                      mb: 0.75,
                    }}
                  >
                    <Typography variant="h6">
                      {category.name}
                    </Typography>

                    <Chip
                      size="small"
                      label={category.isActive ? "Active" : "Inactive"}
                      color={category.isActive ? "success" : "default"}
                      variant="outlined"
                    />
                  </Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    {category.description || "No description provided."}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1,
                  }}
                >
                  <Button
                    variant="outlined"
                    onClick={() => startEditing(category)}
                  >
                    Edit
                  </Button>

                  {category.isActive && (
                    <Button
                      variant="outlined"
                      color="error"
                      disabled={busyId === category.id}
                      onClick={() => void handleDeactivate(category)}
                    >
                      {busyId === category.id
                        ? "Deactivating..."
                        : "Deactivate"}
                    </Button>
                  )}
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  );
}
