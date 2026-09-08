import React, { useEffect, useState } from "react";
import styles from "./IntroScreen.module.scss";
import content from "../content.json";

export default function IntroScreen({ ready }) {
  const [shown, setShown] = useState(true);
  const [fading, setFading] = useState(false);
  const [progress, setProgress] = useState(0);

  // creep up to 90% while waiting for fonts
  useEffect(() => {
    if (ready) return;
    const id = setInterval(() => setProgress((p) => Math.min(90, p + 4)), 80);
    return () => clearInterval(id);
  }, [ready]);

  useEffect(() => {
    if (!ready) return;
    setProgress(100);
    const t1 = setTimeout(() => setFading(true), 900);
    const t2 = setTimeout(() => setShown(false), 900 + 1000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [ready]);

  if (!shown) return null;
  return (
    <div className={`${styles.intro} ${fading ? styles.fading : ""}`}>
      <div className={styles.content}>
        <h1>{content.meta.title}</h1>
        <div>{content.meta.hint}</div>
        <div className={styles.bar}><div className={styles.fill} style={{ width: `${progress}%` }} /></div>
      </div>
      <div className={styles.credit}>{content.meta.credit}</div>
    </div>
  );
}
