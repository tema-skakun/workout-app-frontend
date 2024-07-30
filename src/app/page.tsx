import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <main className={styles.main}>
      <h1 className={styles.header}>Welcome to Our Fitness App</h1>
      <p className={styles.content}>
        Track your workouts, stay fit, and achieve your fitness goals.
      </p>
      <Link href="/login">
        <button className={styles.button}>Login</button>
      </Link>
      <Link href="/register">
        <button className={styles.button}>Register</button>
      </Link>
    </main>
  );
}
