export type Error = {
	error: string;
	type: ErrorType;
};

enum ErrorType {
	Incomplete = 0,
	Unknown = 1
}

export default ErrorType;
