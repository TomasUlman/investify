/**
 * RemoveItemDialog component to confirm the removal of an item from the portfolio.
 * @param {Object} props - The component props.
 * @param {string} props.ticker - The ticker of the item to be removed.
 * @param {Function} props.onRemove - The function to call when the item is confirmed for removal.
 * @param {Function} props.onClose - The function to call when the dialog is closed without removing the item.
 * @returns {JSX.Element} The rendered remove item dialog component.
 */
export default function RemoveItemDialog({ ticker, onRemove, onClose }) {
    return (
        <div>
            <p>{`Opravdu si přejete smazat ${ticker} z portfolia?`}</p>
            <div className='modal-remove-buttons'>
                <button className='remove-yes-btn' onClick={onRemove}>Ano</button>
                <button className='remove-no-btn' onClick={onClose}>Ne</button>
            </div>
        </div>
    );
}