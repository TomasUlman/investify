/**
 * Modal component to display content in a modal dialog.
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The content to display inside the modal.
 * @param {string} props.modalClassName - The class name for the modal container.
 * @param {string} [props.closeBtnClassName='close-btn'] - The class name for the close button.
 * @param {string} [props.overLayClassName='overlay'] - The class name for the overlay.
 * @param {Function} props.handleClose - The function to call when the modal is closed.
 * @returns {JSX.Element} The rendered modal component.
 */
export default function Modal({
    children,
    modalClassName,
    closeBtnClassName = 'close-btn',
    overLayClassName = 'overlay',
    handleClose
}) {

    return (
        <>
            <div className={modalClassName}>
                <button className={closeBtnClassName} onClick={handleClose}>&times;</button>
                {children}
            </div>
            <div className={overLayClassName} onClick={handleClose}></div>
        </>
    );
}