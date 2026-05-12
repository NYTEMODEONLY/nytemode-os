import styled from "styled-components";
import { TASKBAR_HEIGHT } from "utils/constants";

const TASKBAR_Z_INDEX = 100000;

const StyledTaskbar = styled.nav`
  background-color: ${({ theme }) => theme.colors.taskbar.background};
  bottom: calc(env(safe-area-inset-bottom, 0px) * -1);
  contain: size layout;
  height: calc(${TASKBAR_HEIGHT}px + env(safe-area-inset-bottom, 0px));
  left: 0;
  padding-bottom: env(safe-area-inset-bottom, 0);
  position: fixed;
  right: 0;
  width: 100vw;
  z-index: ${TASKBAR_Z_INDEX};

  > * {
    height: ${TASKBAR_HEIGHT}px;
  }

  &::after {
    backdrop-filter: ${({ theme }) => `blur(${theme.sizes.taskbar.blur})`};
    content: "";
    inset: 0;
    position: absolute;
    z-index: -${TASKBAR_Z_INDEX};
  }
`;

export default StyledTaskbar;
