import React from 'react';
import { RenderBlocks } from '@plone/volto/components';
import { getPanels, accordionBlockHasValue } from './util';
import { Accordion } from 'semantic-ui-react';
import { withBlockExtensions } from '@plone/volto/helpers';

import cx from 'classnames';
import { Icon } from '@plone/volto/components';
import AnimateHeight from 'react-animate-height';
import config from '@plone/volto/registry';
import './editor.less';

const View = (props) => {
  const { data } = props;
  const panels = getPanels(data.data);
  const metadata = props.metadata || props.properties;
  const [activeIndex, setActiveIndex] = React.useState([]);
  const { titleIcons } = config.blocks.blocksConfig.accordion;
  const handleClick = (e, itemProps) => {
    const { index } = itemProps;
    if (data.non_exclusive) {
      const newIndex =
        activeIndex.indexOf(index) === -1
          ? [...activeIndex, index]
          : activeIndex.filter((item) => item !== index);

      setActiveIndex(newIndex);
    } else {
      const newIndex =
        activeIndex.indexOf(index) === -1
          ? [index]
          : activeIndex.filter((item) => item !== index);

      setActiveIndex(newIndex);
    }
  };

  const isExclusive = (index) => {
    return activeIndex.includes(index);
  };

  React.useEffect(() => {
    return data.collapsed ? setActiveIndex([]) : setActiveIndex([0]);
  }, [data.collapsed]);

  return (
    <div className="accordion-block">
      {panels.map(([id, panel], index) => {
        return accordionBlockHasValue(panel) ? (
          <Accordion fluid styled key={id} exclusive={!data.exclusive}>
            <React.Fragment>
              <Accordion.Title
                as={data.title_size}
                active={isExclusive(index)}
                index={index}
                onClick={handleClick}
                className={cx('accordion-title', {
                  'align-arrow-left': !props?.data?.right_arrows,
                  'align-arrow-right': props?.data?.right_arrows,
                })}
              >
                {isExclusive(index) ? (
                  <Icon
                    name={
                      props?.data?.right_arrows
                        ? titleIcons.opened.rightPosition
                        : titleIcons.opened.leftPosition
                    }
                    size={titleIcons.size}
                  />
                ) : (
                  <Icon
                    name={
                      props?.data?.right_arrows
                        ? titleIcons.closed.rightPosition
                        : titleIcons.closed.leftPosition
                    }
                    size={titleIcons.size}
                  />
                )}
                <span>{panel?.title}</span>
              </Accordion.Title>
              <AnimateHeight
                animateOpacity
                duration={500}
                height={isExclusive(index) ? 'auto' : 0}
              >
                <Accordion.Content active={isExclusive(index)}>
                  <RenderBlocks
                    {...props}
                    metadata={metadata}
                    content={panel}
                  />
                </Accordion.Content>
              </AnimateHeight>
            </React.Fragment>
          </Accordion>
        ) : null;
      })}
    </div>
  );
};

export default withBlockExtensions(View);
