import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <h1>Welcome to My App</h1>
      <a href="/login">Login</a>
      <a href="/register">Register</a>
    </main>
  );
}
