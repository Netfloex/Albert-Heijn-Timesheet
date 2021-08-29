import type { FC } from "react";

export type RowData = Record<string, JSX.Element>;
export type ColData = {
	prop: string;
	name?: string;
};

export type RenderCell = FC<{ row: RowData; col: ColData }>;
