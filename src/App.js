import { useRef } from "react";
import { useAtom } from "jotai";
import ListCompound from "./listCompound";
import CounterCompound from "./counterCompound";
import { useMolecule, ScopeProvider } from "jotai-molecules";

import "./styles.css";
import React from "react";

let _id = 0;
const makeId = () => `${_id++}`;

function Actions() {
  const addProject = ListCompound.Hooks.useAddProject();

  return <button onClick={() => addProject([1], makeId())}>Add Project</button>;
}

function Project({ id }) {
  const ref = useRef(null);
  const projectAtoms = useMolecule(ListCompound.Molecule);
  const [title] = useAtom(projectAtoms.project(id));
  const changeProject = ListCompound.Hooks.useChangeProject();
  const removeProject = ListCompound.Hooks.useRemoveProject();

  return (
    <div style={{ display: "flex", alignItems: "start" }}>
      <div
        ref={ref}
        contentEditable={true}
        suppressContentEditableWarning
        onInput={(e) => {
          changeProject(id, e.target.textContent);

          const range = document.createRange();
          range.selectNodeContents(ref.current);
          range.collapse(false);

          const selection = window.getSelection();
          selection.removeAllRanges();
          selection.addRange(range);
        }}
      >
        {title}
      </div>
      <button onClick={() => removeProject(id)}>remove</button>
    </div>
  );
}

const ProjectMemoized = React.memo(Project);

function Projects() {
  const projectAtoms = useMolecule(ListCompound.Molecule);
  const [ids] = useAtom(projectAtoms.rootOrdering);

  return (
    <div>
      <Actions />
      {ids.map((id) => (
        <ProjectMemoized key={id} id={id} />
      ))}
    </div>
  );
}

function Counter() {
  const { counterAtom } = useMolecule(CounterCompound.Molecule);
  const increment = CounterCompound.Hooks.useIncrement();
  const count = useAtom(counterAtom);

  return <div onClick={() => increment()}>{count}</div>;
}

export default function App() {
  const children = [];

  for (let i = 0; i < 10; i++) {
    children.push(
      <ScopeProvider key={i} scope={ListCompound.Scope} value={i}>
        <Projects />
      </ScopeProvider>
    );
  }

  return (
    <div className="App">
      {children}
      {/* <ScopeProvider scope={CounterCompound.Scope} value={1}>
        <Counter />
      </ScopeProvider>

      <ScopeProvider scope={CounterCompound.Scope} value={2}>
        <Counter />
      </ScopeProvider> */}
    </div>
  );
}
