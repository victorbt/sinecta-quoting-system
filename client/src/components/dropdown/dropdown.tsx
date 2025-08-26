import { useCallback, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { DropdownContext } from './dropdown-context';

export const Dropdown = (props:any) => {
  let type:string | number | any | undefined = undefined
  const { children, delay = 50 } = props;
  const [anchorEl, setAnchorEl] = useState(type);
  const cleanupRef = useRef(type);

  const handleTriggerEnter = useCallback((event:any) => {
    clearTimeout(cleanupRef.current);
    setAnchorEl(event.currentTarget);
  }, []);

  const handleTriggerLeave = useCallback((_:any) => {
    cleanupRef.current = setTimeout(() => {
      setAnchorEl(null);
    }, delay);
  }, [delay]);

  const handleMenuEnter = useCallback((_:any) => {
    clearTimeout(cleanupRef.current);
  }, []);

  const handleMenuLeave = useCallback((_:any) => {
    cleanupRef.current = setTimeout(() => {
      setAnchorEl(null);
    }, delay);
  }, [delay]);

  const open = !!(anchorEl);

  return (
    <DropdownContext.Provider
      value={{
        anchorEl,
        onMenuEnter: handleMenuEnter,
        onMenuLeave: handleMenuLeave,
        onTriggerEnter: handleTriggerEnter,
        onTriggerLeave: handleTriggerLeave,
        open
      }}
    >
      {children}
    </DropdownContext.Provider>
  );
};

Dropdown.propTypes = {
  children: PropTypes.arrayOf(PropTypes.any).isRequired,
  delay: PropTypes.number
};
