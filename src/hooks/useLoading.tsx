import { useState } from "react";

const useLoading = (): [boolean, (isLoading: boolean) => void] => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  return [isLoading, setIsLoading];
};

export default useLoading;
