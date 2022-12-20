import * as React from 'react';
import { FileContent } from './type';

interface GlobalContext {
  fileContent: FileContent | null,
}

const defaultValues: GlobalContext = {
  fileContent: null,
}

export default React.createContext(defaultValues);