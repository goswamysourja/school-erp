"use client";

import { useState } from "react";

import {
  Alert,
  Button,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";

import { FormCard }
  from "@/components/ui/form-card";

interface Section {
  id: string;
  name: string;
}

interface Props {
  id: string;
  initialAdmissionNumber: string;
  initialFirstName: string;
  initialLastName: string;
  initialGender: string;
  initialDateOfBirth?: string;
  initialGuardianName?: string;
  initialPhone?: string;
  initialAddress?: string;
  initialSectionId: string;
  sections: Section[];
}

export function EditStudentForm({
  id,
  initialAdmissionNumber,
  initialFirstName,
  initialLastName,
  initialGender,
  initialDateOfBirth,
  initialGuardianName,
  initialPhone,
  initialAddress,
  initialSectionId,
  sections,
}: Props) {
  const [
    admissionNumber,
    setAdmissionNumber,
  ] = useState(
    initialAdmissionNumber
  );

  const [
    firstName,
    setFirstName,
  ] = useState(
    initialFirstName
  );

  const [
    lastName,
    setLastName,
  ] = useState(
    initialLastName
  );

  const [gender, setGender] =
    useState(
      initialGender
    );

  const [
    dateOfBirth,
    setDateOfBirth,
  ] = useState(
    initialDateOfBirth ?? ""
  );

  const [
    guardianName,
    setGuardianName,
  ] = useState(
    initialGuardianName ?? ""
  );

  const [phone, setPhone] =
    useState(
      initialPhone ?? ""
    );

  const [address, setAddress] =
    useState(
      initialAddress ?? ""
    );

  const [
    sectionId,
    setSectionId,
  ] = useState(
    initialSectionId
  );

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response =
        await fetch(
          `/api/students/${id}`,
          {
            method: "PATCH",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              admissionNumber,
              firstName,
              lastName,
              gender,
              dateOfBirth,
              guardianName,
              phone,
              address,
              sectionId,
            }),
          }
        );

      const data =
        await response.json();

      if (!data.success) {
        throw new Error(
          data.message
        );
      }

      window.location.href =
        "/dashboard/students";
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to update student"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <FormCard>
      <form
        onSubmit={
          handleSubmit
        }
      >
        <Stack spacing={3}>
          {error && (
            <Alert severity="error">
              {error}
            </Alert>
          )}

          <TextField
            label="Admission Number"
            value={
              admissionNumber
            }
            onChange={(e) =>
              setAdmissionNumber(
                e.target.value
              )
            }
            fullWidth
            required
          />

          <TextField
            label="First Name"
            value={firstName}
            onChange={(e) =>
              setFirstName(
                e.target.value
              )
            }
            fullWidth
            required
          />

          <TextField
            label="Last Name"
            value={lastName}
            onChange={(e) =>
              setLastName(
                e.target.value
              )
            }
            fullWidth
            required
          />

          <TextField
            select
            label="Gender"
            value={gender}
            onChange={(e) =>
              setGender(
                e.target.value
              )
            }
            fullWidth
            required
          >
            <MenuItem value="MALE">
              Male
            </MenuItem>

            <MenuItem value="FEMALE">
              Female
            </MenuItem>

            <MenuItem value="OTHER">
              Other
            </MenuItem>
          </TextField>

          <TextField
            type="date"
            label="Date Of Birth"
            value={dateOfBirth}
            onChange={(e) =>
              setDateOfBirth(
                e.target.value
              )
            }
            fullWidth
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
          />

          <TextField
            label="Guardian Name"
            value={
              guardianName
            }
            onChange={(e) =>
              setGuardianName(
                e.target.value
              )
            }
            fullWidth
          />

          <TextField
            label="Phone"
            value={phone}
            onChange={(e) =>
              setPhone(
                e.target.value
              )
            }
            fullWidth
          />

          <TextField
            label="Address"
            value={address}
            onChange={(e) =>
              setAddress(
                e.target.value
              )
            }
            fullWidth
            multiline
            rows={3}
          />

          <TextField
            select
            label="Section"
            value={sectionId}
            onChange={(e) =>
              setSectionId(
                e.target.value
              )
            }
            fullWidth
            required
          >
            <MenuItem
              value=""
              disabled
            >
              Select Section
            </MenuItem>

            {sections.map(
              (section) => (
                <MenuItem
                  key={section.id}
                  value={section.id}
                >
                  {section.name}
                </MenuItem>
              )
            )}
          </TextField>

          <Stack
            direction="row"
            spacing={2}
          >
            <Button
              variant="outlined"
              href="/dashboard/students"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={
                loading
              }
            >
              {loading
                ? "Saving..."
                : "Save Changes"}
            </Button>
          </Stack>
        </Stack>
      </form>
    </FormCard>
  );
}