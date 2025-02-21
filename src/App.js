import Logo from './Assets/Logo.svg';
import { useState, useRef, useEffect } from 'react';
import { useKey } from './hooks/useKey.js';
import { useGetInitialData } from './hooks/useGetInitialData.js';
import { useUpdateMonthlyPerformance } from './hooks/useUpdateMonthlyPerformance.js';
import { getBarChartData, getSummaryData } from './Helpers';
import { addPortfolioItem, removePortfolioItem, updatePortfolioItem, checkAndClearPerformance } from './Firebase';
import { auth, logoutUser } from "./Firebase";
import Login from "./Components/Login";
import { LineChartComponent as LineChart } from './Components/Chart';
import Summary from './Components/Summary';
import Tabs from './Components/Tabs';
import Table from './Components/Table';
import Modal from './Components/Modal';
import FormAdd from './Components/FormAdd';
import FormEdit from './Components/FormEdit';
import RemoveItemDialog from './Components/RemoveItemDialog';

/**
 * Main application component.
 * @returns {JSX.Element} The rendered component.
 */
export default function App() {
  const [user, setUser] = useState(auth.currentUser);
  const [portfolio, setPortfolio] = useState([]);
  const [monthlyPerformance, setMonthlyPerformance] = useState([]);
  const [isOpenModalAdd, setIsOpenModalAdd] = useState(false);
  const [isOpenModalEdit, setIsOpenModalEdit] = useState(false);
  const [isOpenModalRemove, setIsOpenModalRemove] = useState(false);
  const itemToRemove = useRef(null);
  const itemToEdit = useRef(null);
  const { isLoading, error, ccyRate } = useGetInitialData(setPortfolio, setMonthlyPerformance);
  const summaryData = getSummaryData(portfolio, ccyRate);
  const barChartData = getBarChartData(portfolio);

  useKey('Escape', () => setIsOpenModalAdd(false));
  useKey('Escape', () => setIsOpenModalEdit(false));
  useKey('Escape', () => setIsOpenModalRemove(false));

  useEffect(() => {
    checkAndClearPerformance(setMonthlyPerformance);
  }, [portfolio]);

  useUpdateMonthlyPerformance(portfolio, summaryData, monthlyPerformance, setMonthlyPerformance);

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  /**
 * Handles user logout.
 * @returns {Promise<void>}
 */
  async function handleLogout() {
    await logoutUser();
    setUser(null);
  }

  /**
   * Toggles the add item modal.
   */
  function handleToggleModalAdd() {
    setIsOpenModalAdd(!isOpenModalAdd);
  }

  /**
 * Opens the edit item modal.
 * @param {string} ticker - The ticker of the item to edit.
 */
  function handleOpenModalEdit(ticker) {
    setIsOpenModalEdit(true);
    itemToEdit.current = ticker;
  }

  /**
 * Closes the edit item modal.
 */
  function handleCloseModalEdit() {
    setIsOpenModalEdit(false);
    itemToEdit.current = null;
  }

  /**
 * Opens the remove item modal.
 * @param {string} ticker - The ticker of the item to remove.
 */
  function handleOpenModalRemove(ticker) {
    setIsOpenModalRemove(true);
    itemToRemove.current = ticker;
  }

  /**
 * Closes the remove item modal.
 */
  function handleCloseModalRemove() {
    setIsOpenModalRemove(false);
    itemToRemove.current = null;
  }

  /**
 * Adds a new item to the portfolio.
 * @param {Object} newItem - The new item to add.
 */
  function handleAddItem(newItem) {
    setPortfolio(prevPortfolio => [...prevPortfolio, newItem]);
    addPortfolioItem(newItem);
    setIsOpenModalAdd(false);
  }

  /**
 * Removes an item from the portfolio.
 */
  function handleRemoveItem() {
    if (itemToRemove.current) {
      setPortfolio(portfolio.filter(item => item.ticker !== itemToRemove.current));
      removePortfolioItem(itemToRemove.current);
    }
    handleCloseModalRemove();
  }

  /**
 * Edits an existing item in the portfolio.
 * @param {Object} newItem - The updated item.
 */
  function handleEditItem(newItem) {
    setPortfolio(prevPortfolio => [...prevPortfolio.filter(item => item.ticker !== newItem.ticker), newItem]);
    updatePortfolioItem(newItem.ticker, newItem);
    handleCloseModalEdit();
  }

  return (
    <div>
      {isLoading && <Loader />}
      {error && <ErrorMessage message={error} />}
      {!isLoading && !error &&
        <>
          <Summary data={summaryData} onLogOut={handleLogout} />
          <LineChart data={monthlyPerformance} />
          <div className='table-charts-container'>
            <Table
              data={portfolio}
              onAdd={handleToggleModalAdd}
              onEdit={handleOpenModalEdit}
              onRemove={handleOpenModalRemove}
            />
            <Tabs data={barChartData} />
          </div>
        </>
      }
      {isOpenModalAdd &&
        <Modal modalClassName='modal-add' handleClose={handleToggleModalAdd}>
          <FormAdd portfolio={portfolio} onAdd={handleAddItem} />
        </Modal>
      }
      {isOpenModalEdit &&
        <Modal modalClassName='modal-edit' handleClose={handleCloseModalEdit}>
          <FormEdit ticker={itemToEdit.current} onEdit={handleEditItem} />
        </Modal>
      }
      {isOpenModalRemove &&
        <Modal modalClassName='modal-remove' handleClose={handleCloseModalRemove}>
          <RemoveItemDialog ticker={itemToRemove.current} onClose={handleCloseModalRemove} onRemove={handleRemoveItem} />
        </Modal>
      }
    </div>
  );
}

/**
 * Loader component.
 * @returns {JSX.Element} The rendered component.
 */
function Loader() {
  return (
    <div className='loader'>
      <img src={Logo} alt='Logo'></img>
      <p>LOADING...</p>
    </div>
  );
}

/**
 * ErrorMessage component.
 * @param {Object} props - The component props.
 * @param {string} props.message - The error message to display.
 * @returns {JSX.Element} The rendered component.
 */
function ErrorMessage({ message }) {
  return (
    <div className='error'>
      <p>{`❌ ${message}`}</p>
    </div>
  );
}