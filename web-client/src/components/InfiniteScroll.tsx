import React from 'react'
import InView, { useInView } from 'react-intersection-observer';
// We can add pollyfills for browsers which dont support intersection-observer
// import 'intersection-observer';

const InfiniteScroll = (props: {
  children: React.ReactNode,
  elementAs: any,
  onChange?: Function,
}) => {
  const { ref } = useInView({});
  const { children, onChange, elementAs } = props;

  const onViewChange = (inView: boolean) => {
    if (onChange) {
      onChange(inView);
    }
  }
  return (
    <div ref={ref}>
      <InView
        as={elementAs}
        onChange={onViewChange}
      >
        {children}
      </InView>
    </div>
  );
};

InfiniteScroll.defaultProps = {
  elementAs: 'div',
};

export default InfiniteScroll;

