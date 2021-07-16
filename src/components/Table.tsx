import styles from "./Table.module.scss";

import { FC } from "react";

type ColDef = Array<{
	prop: string;
	name?: string;
}>;

/**
 * Creates a responsive table
 * @param props.data - The data to use
 * @param props.colDef - How the columns should be rendered
 */

const Table: FC<{
	data: Record<string, string>[];
	colDef: ColDef;
}> = ({ data, colDef }) => {
	return (
		<table className={styles.styledTable}>
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
							<td key={col.prop}>{data[col.prop]}</td>
						))}
					</tr>
				))}
			</tbody>
		</table>
	);
};

export default Table;
