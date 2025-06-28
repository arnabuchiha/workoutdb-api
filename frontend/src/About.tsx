import { useState } from "react";

function About() {
  const [count] = useState(0);

  return (
    <>
      <div>{count}</div>
    </>
  );
}

export default About;
