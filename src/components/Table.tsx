import styles from "./Table.module.scss";

import type { FC } from "react";

type ColDef = Array<{
	prop: string;
	name?: string;
}>;

/**
 * Creates a responsive table
 * @param props.data - The data to use
 * @param props.colDef - How the columns should be rendered
 */

const Render: FC<{ Element: FC }> = ({ Element }) => {
	return <Element />;
};
const Table: FC<{
	data: Record<string, FC>[];
	colDef: ColDef;
	className?: string;
}> = ({ data, colDef, className = "" }) => {
	return (
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
							<>
								{data[col.prop] ? (
									<Render Element={data[col.prop]} />
								) : (
									<td key={col.prop} />
								)}
							</>
						))}
					</tr>
				))}
			</tbody>
		</table>
	);
};

export default Table;
