import * as React from 'react';
import { FileContent } from '../type';

interface GlobalContext {
  fileContent: FileContent | null,
  fileId?: number | null,
  user?: {
    email: string
  } | null
}

const defaultValues: GlobalContext = {
  fileContent: null,
  fileId: null,
  user: null
}

export default React.createContext(defaultValues);