import { atom, useAtom } from "jotai";
import { molecule, createScope, useMolecule } from "jotai-molecules";
import { useCallback } from "react";
import { useAtomCallback } from "jotai/react/utils";
import produce from "immer";

const Scope = createScope(undefined);
const Molecule = molecule((getMol, getScope) => {
  getScope(Scope);
  return { counterAtom: atom(0) };
});

const useIncrement = () => {
  const { counterAtom } = useMolecule(Molecule);

  return useAtomCallback(
    useCallback(
      (get, set) => {
        set(counterAtom, (x) => x + 1);
      },
      [counterAtom]
    )
  );
};

const CounterCompund = {
  Scope,
  Molecule,
  Hooks: {
    useIncrement
  }
};

export default CounterCompund;
