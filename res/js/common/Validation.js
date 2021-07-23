export function validationCheck(inputRef, setValidationFlg) {
  if (inputRef.current) {
    const ref = inputRef.current;
    if (!ref.validity.valid) {
      setValidationFlg(true);
      return false;
    } else {
      setValidationFlg(false);
      return true;
    }
  }
}
