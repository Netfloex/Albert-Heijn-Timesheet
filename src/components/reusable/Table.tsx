import styles from "./Table.module.scss";

import { FC } from "react";

import { ColData, RenderCell, RowData } from "@models/Table";

/**
 * Creates a responsive table
 * @param props.data - The data to use
 * @param props.colDef - How the columns should be rendered
 */

export const Table: FC<{
	data: RowData[];
	colDef: ColData[];
	className?: string;
	RenderCell: RenderCell;
}> = ({
	data,
	colDef,
	className = "",
	RenderCell = ({ children }): JSX.Element => <td>{children}</td>
}) => (
	<table className={`${styles.styledTable} ${className}`.trim()}>
		<thead>
			<tr>
				{colDef.map((col) => (
					<th key={col.prop}>{col.name ?? col.prop}</th>
				))}
			</tr>
		</thead>
		<tbody>
			{data.map((data, row) => (
				<tr key={row}>
					{colDef.map((col) => (
						<RenderCell row={data} col={col} key={col.prop}>
							{data[col.prop]}
						</RenderCell>
					))}
				</tr>
			))}
		</tbody>
	</table>
);
