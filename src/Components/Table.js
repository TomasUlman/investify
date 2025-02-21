import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";

/**
 * Table component to display the portfolio data in a table format.
 * @param {Object} props - The component props.
 * @param {Array<Object>} props.data - The portfolio data to display.
 * @param {Function} props.onAdd - Function to handle adding a new item.
 * @param {Function} props.onEdit - Function to handle editing an item.
 * @param {Function} props.onRemove - Function to handle removing an item.
 * @returns {JSX.Element} The rendered table component.
 */
export default function Table({ data, onAdd, onEdit, onRemove }) {
    const sortedData = [...data].sort((a, b) => b.investment - a.investment);

    return (
        <div className='table-container'>
            <table className='table table-dark table-hover table-sm'>
                <thead>
                    <tr>
                        <th>Název</th>
                        <th>Ticker</th>
                        <th>Počet</th>
                        <th>Investováno</th>
                        <th>Hodnota</th>
                        <th>Cena</th>
                        <th>Profit</th>
                        <th>Profit (%)</th>
                        <th></th>
                        <th>
                            <FontAwesomeIcon icon={faPlus} size='lg' color='#fff' className='table-btn' onClick={onAdd} />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {sortedData.map(item => (
                        <Item onEdit={onEdit} onRemove={onRemove} itemData={item} key={item.ticker} />
                    ))}
                </tbody>
            </table>
        </div>
    );
}

/**
 * Item component to display a single row of portfolio data.
 * @param {Object} props - The component props.
 * @param {Object} props.itemData - The data of the item to display.
 * @param {Function} props.onEdit - Function to handle editing the item.
 * @param {Function} props.onRemove - Function to handle removing the item.
 * @returns {JSX.Element} The rendered item component.
 */
function Item({ itemData, onEdit, onRemove }) {
    return (
        <tr>
            <td>{itemData.name}</td>
            <td>{itemData.ticker}</td>
            <td>{itemData.shares}</td>
            <td>{itemData.investment}</td>
            <td>{itemData.value.toFixed(2)}</td>
            <td>{itemData.price.toFixed(2)}</td>
            <td>{itemData.profit.toFixed(2)}</td>
            <td>{`${itemData.profitPercentage.toFixed(1)} %`}</td>
            <td>
                <FontAwesomeIcon
                    icon={faPenToSquare}
                    size='sm'
                    color='#fff'
                    className='table-btn'
                    onClick={() => onEdit(itemData.ticker)}
                />
            </td>
            <td>
                <FontAwesomeIcon
                    icon={faTrashCan}
                    size='sm'
                    color='#fff'
                    className='table-btn'
                    onClick={() => onRemove(itemData.ticker)}
                />
            </td>
        </tr>
    );
}