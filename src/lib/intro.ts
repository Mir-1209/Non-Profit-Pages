import { createContext, useContext } from 'react';

/** True once the intro preloader has finished (or was skipped). */
export const IntroContext = createContext(true);
export const useIntroDone = () => useContext(IntroContext);
