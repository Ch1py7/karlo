interface ModalProps {
	children: React.ReactNode
}

export const Modal: React.FC<ModalProps> = ({ children }): React.ReactNode => {
	return (
		<div
			style={{ marginTop: 0 }}
			className="fixed inset-0 bg-black bg-opacity-50 z-10 flex items-center justify-center left-0"
		>
			<div className="bg-white rounded-lg p-6 w-full max-w-md">{children}</div>
		</div>
	)
}
