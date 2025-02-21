import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, set, remove, update } from "firebase/database";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
const db = getDatabase(firebase);
export const auth = getAuth(firebase);

/**
 * Logs in a user with email and password.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<Object>} The logged-in user.
 * @throws {Error} If login fails.
 */
export async function loginUser(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user; // Vracíme přihlášeného uživatele
    } catch (error) {
        console.error("❌ Chyba při přihlášení:", error.message);
        throw new Error("Špatný e-mail nebo heslo");
    }
}

/**
 * Logs out the current user.
 * @returns {Promise<boolean>} True if logout is successful.
 * @throws {Error} If logout fails.
 */
export async function logoutUser() {
    try {
        await signOut(auth);
        return true; // Úspěšné odhlášení
    } catch (error) {
        console.error("❌ Chyba při odhlášení:", error.message);
        throw new Error("Odhlášení se nezdařilo");
    }
}

/**
 * Fetches data from the database.
 * @param {string} node - The database node to fetch data from.
 * @returns {Promise<Array>} The fetched data.
 * @throws {Error} If fetching data fails.
 */
export async function getDbData(node) {
    try {
        const snapshot = await get(ref(db, node));
        if (snapshot.exists()) {
            const data = snapshot.val();
            return Object.keys(data).map(key => {
                const value = data[key];

                return typeof value === "object"
                    ? { id: key, ...value }  // pro portfolio
                    : { id: key, value };   // pro performance
            });
        } else {
            return [];
        }
    } catch (err) {
        console.error("❌ Failed to fetch firebase data:", err.message);
        throw new Error("Chyba při načítání dat z databáze.");
    }
}

/**
 * Adds a new item to the portfolio.
 * @param {Object} newItem - The new item to add.
 * @returns {Promise<boolean>} True if the item is added successfully.
 * @throws {Error} If adding the item fails.
 */
export async function addPortfolioItem(newItem) {
    // Replacing . with _ in the ticker to avoid errors in Firebase
    const ticker = newItem.ticker.includes('.') ? newItem.ticker.replace(/\./g, '_') : newItem.ticker;
    const dbItem = {
        ticker: ticker,
        investment: newItem.investment,
        shares: newItem.shares
    }

    try {
        await set(ref(db, `portfolio/${ticker}`), dbItem);
        return true;
    } catch (error) {
        console.error("Chyba při přidání položky:", error);
        throw error;
    }
}

/**
 * Removes an item from the portfolio.
 * @param {string} ticker - The ticker of the item to remove.
 * @returns {Promise<boolean>} True if the item is removed successfully.
 * @throws {Error} If removing the item fails.
 */
export async function removePortfolioItem(ticker) {
    const tickerToDelete = ticker.includes('.') ? ticker.replace(/\./g, '_') : ticker;
    try {
        await remove(ref(db, `portfolio/${tickerToDelete}`));
        return true;
    } catch (error) {
        console.error("Chyba při mazání položky:", error);
        throw error;
    }
}

/**
 * Updates an existing item in the portfolio.
 * @param {string} ticker - The ticker of the item to update.
 * @param {Object} newItem - The updated item.
 * @returns {Promise<boolean>} True if the item is updated successfully.
 * @throws {Error} If updating the item fails.
 */
export async function updatePortfolioItem(ticker, newItem) {
    const tickerToUpdate = ticker.includes('.') ? ticker.replace(/\./g, '_') : ticker;
    const dbItem = {
        ticker: tickerToUpdate,
        investment: newItem.investment,
        shares: newItem.shares
    }
    try {
        await update(ref(db, `portfolio/${tickerToUpdate}`), dbItem);
        return true;
    } catch (error) {
        console.error("Chyba při aktualizaci položky:", error);
        throw error;
    }
}

/**
 * Checks and clears performance data if the portfolio is empty.
 * @param {Function} setMonthlyPerformance - The function to set monthly performance.
 * @returns {Promise<void>}
 */
export async function checkAndClearPerformance(setMonthlyPerformance) {
    try {
        const snapshot = await get(ref(db, "portfolio"));

        if (!snapshot.exists()) {
            await set(ref(db, "performance"), {});
            await setMonthlyPerformance([]); // Clear performance data in the app
        }
    } catch (err) {
        console.error("❌ Error deleting data:", err.message);
    }
}

/**
 * Adds a new performance entry to the database.
 * @param {Object} newPerformance - The new performance entry.
 * @returns {Promise<boolean>} True if the entry is added successfully.
 * @throws {Error} If adding the entry fails.
 */
export async function addPerformanceDb(newPerformance) {
    try {
        await set(ref(db, `performance/${newPerformance.id}`), newPerformance.value);
        return true;
    } catch (error) {
        console.error("Chyba při přidání položky:", error);
        throw error;
    }
}

/**
 * Sets a performance entry in the database.
 * @param {Object} newPerformance - The performance entry to set.
 * @returns {Promise<boolean>} True if the entry is set successfully.
 * @throws {Error} If setting the entry fails.
 */
export async function setPerformanceDb(newPerformance) {
    try {
        await set(ref(db, `performance/${newPerformance.id}`), newPerformance.value);
        return true;
    } catch (error) {
        console.error("❌ Chyba při nastavování položky:", error);
        throw error;
    }
}