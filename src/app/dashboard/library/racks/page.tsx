
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

interface LibraryRack {
  id: string;
  rackNumber: string;
  description: string | null;
  location: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count: {
    copies: number;
  };
}

interface RackForm {
  rackNumber: string;
  description: string;
  location: string;
}

const emptyForm: RackForm = {
  rackNumber: "",
  description: "",
  location: "",
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

export default function LibraryRacksPage() {
  const [racks, setRacks] = useState<LibraryRack[]>([]);
  const [form, setForm] = useState<RackForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadRacks() {
    const response = await fetch("/api/library/racks", {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(
        await getErrorMessage(response, "Failed to load library racks."),
      );
    }

    const data = (await response.json()) as LibraryRack[];
    setRacks(data);
  }

  useEffect(() => {
    async function initialize() {
      try {
        setError("");
        await loadRacks();
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load library racks.",
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

  function startEditing(rack: LibraryRack) {
    setEditingId(rack.id);
    setForm({
      rackNumber: rack.rackNumber,
      description: rack.description ?? "",
      location: rack.location ?? "",
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
          ? `/api/library/racks/${encodeURIComponent(editingId)}`
          : "/api/library/racks",
        {
          method: isEditing ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            rackNumber: form.rackNumber.trim(),
            description: form.description.trim(),
            location: form.location.trim(),
          }),
        },
      );

      if (!response.ok) {
        throw new Error(
          await getErrorMessage(
            response,
            isEditing
              ? "Failed to update rack."
              : "Failed to create rack.",
          ),
        );
      }

      setSuccess(
        isEditing
          ? "Rack updated successfully."
          : "Rack created successfully.",
      );

      resetForm();
      await loadRacks();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to save rack.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDeactivate(rack: LibraryRack) {
    const confirmed = window.confirm(
      rack._count.copies > 0
        ? `Rack ${rack.rackNumber} contains ${rack._count.copies} book copies. Move every copy to another rack before deactivating it. Continue anyway?`
        : `Deactivate rack ${rack.rackNumber}?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setBusyId(rack.id);
      setError("");
      setSuccess("");

      const response = await fetch(
        `/api/library/racks/${encodeURIComponent(rack.id)}`,
        { method: "DELETE" },
      );

      if (!response.ok) {
        throw new Error(
          await getErrorMessage(
            response,
            "Failed to deactivate rack.",
          ),
        );
      }

      if (editingId === rack.id) {
        resetForm();
      }

      setSuccess(`Rack ${rack.rackNumber} was deactivated.`);
      await loadRacks();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to deactivate rack.",
      );
    } finally {
      setBusyId("");
    }
  }

  const filteredRacks = racks.filter((rack) => {
    const query = search.trim().toLowerCase();

    return (
      !query ||
      rack.rackNumber.toLowerCase().includes(query) ||
      (rack.description ?? "").toLowerCase().includes(query) ||
      (rack.location ?? "").toLowerCase().includes(query)
    );
  });

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 1 }}>
        Rack Management
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Organize library storage locations and locate book copies by rack.
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
          {editingId ? "Edit Rack" : "Create Rack"}
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
            label="Rack Number"
            value={form.rackNumber}
            onChange={(event) =>
              setForm({
                ...form,
                rackNumber: event.target.value,
              })
            }
            required
            fullWidth
          />

          <TextField
            label="Physical Location"
            placeholder="e.g. First floor, east wall"
            value={form.location}
            onChange={(event) =>
              setForm({
                ...form,
                location: event.target.value,
              })
            }
            fullWidth
          />

          <Box sx={{ gridColumn: "1 / -1" }}>
            <TextField
              label="Description"
              placeholder="e.g. Mathematics and science books"
              value={form.description}
              onChange={(event) =>
                setForm({
                  ...form,
                  description: event.target.value,
                })
              }
              multiline
              minRows={2}
              fullWidth
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
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Save Changes"
                  : "Create Rack"}
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
          Racks ({filteredRacks.length})
        </Typography>

        <TextField
          size="small"
          label="Search racks"
          placeholder="Rack number or location"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          sx={{ width: { xs: "100%", sm: 300 } }}
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
      ) : filteredRacks.length === 0 ? (
        <Alert severity="info">
          No racks found. Create a rack or change your search.
        </Alert>
      ) : (
        <Box sx={{ display: "grid", gap: 2 }}>
          {filteredRacks.map((rack) => (
            <Paper
              key={rack.id}
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
                      mb: 1,
                    }}
                  >
                    <Typography variant="h6">
                      {rack.rackNumber}
                    </Typography>

                    <Chip
                      size="small"
                      label={rack.isActive ? "Active" : "Inactive"}
                      color={rack.isActive ? "success" : "default"}
                      variant="outlined"
                    />
                  </Box>

                  <Typography variant="body2">
                    Location: {rack.location || "Not specified"}
                  </Typography>

                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {rack.description || "No description provided."}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    Assigned copies: {rack._count.copies}
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
                    onClick={() => startEditing(rack)}
                  >
                    Edit
                  </Button>

                  {rack.isActive && (
                    <Button
                      variant="outlined"
                      color="error"
                      disabled={busyId === rack.id}
                      onClick={() => void handleDeactivate(rack)}
                    >
                      {busyId === rack.id
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
