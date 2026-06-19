import { useState } from 'react';

interface UseSubmitState<T> {
  loading: boolean;
  success: boolean;
  error: Error | null;
}

export function useSubmitData<T, R>(
  submitter: (data: T) => Promise<R>,
  onSuccess?: (res: R) => void
) {
  const [state, setState] = useState<UseSubmitState<T>>({
    loading: false,
    success: false,
    error: null,
  });

  const submit = async (data: T) => {
    setState({ loading: true, success: false, error: null });
    try {
      const response = await submitter(data);
      setState({ loading: false, success: true, error: null });
      if (onSuccess) onSuccess(response);
      return response;
    } catch (err: any) {
      setState({ loading: false, success: false, error: err });
      throw err;
    }
  };

  const reset = () => {
    setState({ loading: false, success: false, error: null });
  };

  return { ...state, submit, reset };
}
