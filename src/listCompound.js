import { useCallback } from "react";
import { useAtomCallback } from "jotai/react/utils";
import { atom } from "jotai";
import { atomFamily } from "jotai/utils";
import produce from "immer";
import { molecule, useMolecule, createScope } from "jotai-molecules";

import "./styles.css";

const rootId = "root";

const makeInitialData = () => {
  return [
    ["first", "first"],
    ["second", "second"],
    ["third", "third"],
    ["fourth", "fourth"]
  ];
};

const Scope = createScope(undefined);
const Molecule = molecule((getMol, getScope) => {
  getScope(Scope);
  const listAtoms = listAtomFactory(rootId, makeInitialData());
  return listAtoms;
});

const useAddProject = () => {
  const { orderings, projects } = useMolecule(Molecule);

  return useAtomCallback(
    useCallback(
      (get, set, path, project) => {
        set(
          orderings,
          produce((draft) => {
            let ordering = draft[rootId];
            ordering.splice(path[0], 0, project);
          })
        );
        set(
          projects,
          produce((draft) => {
            draft[project] = project;
          })
        );
      },
      [orderings, projects]
    )
  );
};

const useChangeProject = () => {
  const { projects } = useMolecule(Molecule);

  return useAtomCallback(
    useCallback(
      (get, set, project, value) => {
        set(
          projects,
          produce((draft) => {
            draft[project] = value;
          })
        );
      },
      [projects]
    )
  );
};

const useRemoveProject = () => {
  const { orderings, projects, ordering, project } = useMolecule(Molecule);

  return useAtomCallback(
    useCallback((get, set, id) => {
      set(
        orderings,
        produce((draft) => {
          const ordering = draft[rootId];

          const index = ordering.indexOf(id);
          ordering.splice(index, 1);
        })
      );

      set(
        projects,
        produce((draft) => {
          delete draft[id];
        })
      );

      ordering.remove(id);
      project.remove(id);
    }, [])
  );
};

export const listAtomFactory = (rootId, initialData) => {
  const orderings = atom({
    [rootId]: initialData.map(([id]) => id)
  });
  const ordering = atomFamily((id) => atom((get) => get(orderings)[id]));
  const rootOrdering = atom((get) => get(orderings)[rootId]);
  const projects = atom(Object.fromEntries(initialData));
  const project = atomFamily((id) => atom((get) => get(projects)[id]));

  return {
    orderings,
    ordering,
    rootOrdering,
    projects,
    project
  };
};

const ListCompound = {
  Scope,
  Molecule,
  Hooks: {
    useAddProject,
    useChangeProject,
    useRemoveProject
  }
};

export default ListCompound;
