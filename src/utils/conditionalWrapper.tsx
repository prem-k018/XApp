import React from 'react';

// NOTE: Be cautious using this helper. Changing of the condition
//  and wrapping/unwrapping the children will cause children to lose state.
//  This function is only useful for cases where preservation of child state is not critical
//  or if the condition won't change once instantiated
const ConditionalWrapper = ({
  condition,
  wrapper,
  children,
}: {
  condition: boolean;
  wrapper: (children: React.JSX.Element) => React.JSX.Element;
  children: React.JSX.Element;
}) => (condition ? wrapper(children) : children);

export default ConditionalWrapper;
