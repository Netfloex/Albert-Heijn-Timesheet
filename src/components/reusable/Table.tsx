/* eslint css-modules/no-unused-class: [2, { markAsUsed: ["sm"] }] */
import styles from "./Table.module.scss";

import { FC } from "react";

import { ColData, RenderCell, RowData } from "@models/Table";

/**
 * Creates a responsive table
 * @param props.data - The data to use
 * @param props.colDef - How the columns should be rendered
 */

const defaultRenderCell: RenderCell = ({ children }): JSX.Element => (
	<td>{children}</td>
);

export const Table: FC<{
	data: RowData[];
	colDef: ColData[];
	className?: string;
	RenderCell: RenderCell;
}> = ({ data, colDef, className = "", RenderCell = defaultRenderCell }) => (
	<table className={`${styles.styledTable} ${className}`.trim()}>
		<thead>
			<tr>
				{colDef.map((col) => (
					<th key={col.id}>{col.name}</th>
				))}
			</tr>
		</thead>
		<tbody>
			{data.map((data, row) => (
				<tr key={row}>
					{colDef.map((col) => (
						<RenderCell row={data} col={col} key={col.id}>
							{data[col.id]}
						</RenderCell>
					))}
				</tr>
			))}
		</tbody>
	</table>
);
