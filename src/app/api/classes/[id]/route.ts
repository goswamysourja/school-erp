import {
    NextRequest,
    NextResponse,
} from "next/server";

import { Role } from "@prisma/client";

import { requireApiRole } from "@/modules/auth/guards/require-api-role.guard";

import { getClassById } from "@/modules/classes/services/get-class-by-id.service";

import { updateClass } from "@/modules/classes/services/update-class.service";
import {
    updateClassSchema,
} from "@/modules/classes/validators/update-class.validator";

import { toggleClassStatus }
    from "@/modules/classes/services/toggle-class-status.service";
export async function GET(
    request: NextRequest,
    {
        params,
    }: {
        params: Promise<{
            id: string;
        }>;
    }
) {
    try {
        await requireApiRole([
            Role.SUPER_ADMIN,
        ]);

        const { id } =
            await params;

        const classItem =
            await getClassById(id);

        return NextResponse.json({
            success: true,
            classItem,
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message:
                    error instanceof Error
                        ? error.message
                        : "Something went wrong",
            },
            {
                status: 400,
            }
        );
    }
}

export async function PATCH(
    request: NextRequest,
    {
        params,
    }: {
        params: Promise<{
            id: string;
        }>;
    }
) {
    try {
        await requireApiRole([
            Role.SUPER_ADMIN,
        ]);

        const body =
            await request.json();

        const validatedData =
            updateClassSchema.parse(
                body
            );

        const { id } =
            await params;

        const classItem =
            await updateClass({
                id,
                ...validatedData,
            });

        return NextResponse.json({
            success: true,
            classItem,
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message:
                    error instanceof Error
                        ? error.message
                        : "Something went wrong",
            },
            {
                status: 400,
            }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    {
        params,
    }: {
        params: Promise<{
            id: string;
        }>;
    }
) {
    try {
        await requireApiRole([
            Role.SUPER_ADMIN,
        ]);

        const { id } =
            await params;

        const classItem =
            await toggleClassStatus(
                id
            );

        return NextResponse.json({
            success: true,
            classItem,
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message:
                    error instanceof Error
                        ? error.message
                        : "Something went wrong",
            },
            {
                status: 400,
            }
        );
    }
}