import { FaLightbulb } from "react-icons/fa";
import CurrencyConverter from "../components/CurrencyConverter";
import styles from "../styles/Converter.module.css";

export default function Converter() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Currency Converter</h1>
        <p className={styles.subtitle}>
          Know exactly what your money is worth, anywhere in the world
        </p>
      </div>

      <div className={styles.content}>
        <CurrencyConverter />

        <div className={styles.tips}>
          <h3 className={styles.tipsTitle}>
            <FaLightbulb className={styles.inlineIcon} /> Travel money tips
          </h3>
          <ul className={styles.tipsList}>
            <li className={styles.tip}>
              Card payments usually get better rates than airport exchange
              counters
            </li>
            <li className={styles.tip}>
              Always choose to pay in the local currency, not your home currency
            </li>
            <li className={styles.tip}>
              Keep a small amount of local cash for markets and taxis
            </li>
            <li className={styles.tip}>
              Rates shown are live mid-market rates — banks may add a margin
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
