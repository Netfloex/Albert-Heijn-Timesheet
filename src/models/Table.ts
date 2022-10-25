import { FCC } from "@models/FCC";

export type RowData = Record<string, JSX.Element>;
export type ColData = {
	id: number;
	name: string;
};

export type RenderCell = FCC<{ row: RowData; col: ColData }>;
