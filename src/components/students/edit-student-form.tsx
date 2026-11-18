"use client";

import { useState } from "react";

import {
  Alert,
  Button,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { FormCard } from "@/components/ui/form-card";

import { updateStudent } from "@/modules/students/api/update-student";

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
  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [gender, setGender] = useState(initialGender);
  const [dateOfBirth, setDateOfBirth] = useState(
    initialDateOfBirth ?? "",
  );
  const [guardianName, setGuardianName] = useState(
    initialGuardianName ?? "",
  );
  const [phone, setPhone] = useState(initialPhone ?? "");
  const [address, setAddress] = useState(initialAddress ?? "");
  const [sectionId, setSectionId] = useState(initialSectionId);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>,
  ) {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await updateStudent(id, {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        gender,
        dateOfBirth,
        guardianName,
        phone,
        address,
        sectionId,
      });

      window.location.href = "/dashboard/students";
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to update student.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <FormCard>
      <Stack
        component="form"
        onSubmit={handleSubmit}
        spacing={3}
      >
        {error && (
          <Alert severity="error">
            {error}
          </Alert>
        )}

        {/* Generated Admission Number */}
        
          <TextField
            label="Admission Number"
            value={initialAdmissionNumber}
            fullWidth
            slotProps={{
              input: {
                readOnly: true,
              },
            }}
            helperText="System-generated identifier. Cannot be changed."
          />
        

        <TextField
          label="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          fullWidth
          required
          disabled={loading}
        />

        <TextField
          label="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          fullWidth
          required
          disabled={loading}
        />

        <TextField
          select
          label="Gender"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          fullWidth
          required
          disabled={loading}
        >
          <MenuItem value="MALE">Male</MenuItem>
          <MenuItem value="FEMALE">Female</MenuItem>
          <MenuItem value="OTHER">Other</MenuItem>
        </TextField>

        <TextField
          type="date"
          label="Date Of Birth"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          fullWidth
          disabled={loading}
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
        />

        <TextField
          label="Guardian Name"
          value={guardianName}
          onChange={(e) => setGuardianName(e.target.value)}
          fullWidth
          disabled={loading}
        />

        <TextField
          label="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          fullWidth
          disabled={loading}
        />

        <TextField
          label="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          fullWidth
          multiline
          rows={3}
          disabled={loading}
        />

        <TextField
          select
          label="Section"
          value={sectionId}
          onChange={(e) => setSectionId(e.target.value)}
          fullWidth
          required
          disabled={loading}
        >
          {sections.map((section) => (
            <MenuItem
              key={section.id}
              value={section.id}
            >
              {section.name}
            </MenuItem>
          ))}
        </TextField>

        <Stack
          direction={{
            xs: "column-reverse",
            sm: "row",
          }}
          spacing={2}
          sx={{
            justifyContent: "flex-end",
          }}
        >
          <Button
            variant="outlined"
            href="/dashboard/students"
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </Stack>
      </Stack>
    </FormCard>
  );
}