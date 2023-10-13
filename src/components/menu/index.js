import { useDispatch, useSelector } from "react-redux";
import cx from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencil,
  faEraser,
  faRotateLeft,
  faRotateRight,
  faFileArrowDown,
  faSquare,
  faCircle,
  faArrowPointer
} from "@fortawesome/free-solid-svg-icons";

import styles from "./index.module.css";

import { menuItemClick, actionItemClick } from "@/slice/menuSlice";
import PenSubMenu from "../submenu/pen";

import { MENU_ITEMS, SUB_MENU_ITEMS } from "@/constants";
import Toolbox from "../toolbox";

const Menu = () => {
  const dispatch = useDispatch();
  const activeMenuItem = useSelector((state) => state.menu.activeMenuItem);
  const activeSubmenuItem = useSelector((state) => state.menu.activeSubMenuItem);
  const handleMenuClick = (itemName) => {
    dispatch(menuItemClick(itemName));
  };

  const handleActioItemClick = (itemName) => {
    dispatch(actionItemClick(itemName));
  };
  return (
    <>
    <div className={styles.menuContainer}>
      <div className={styles.menuToolsContainer}>
      <div
          className={cx(styles.iconWrapper, {
            [styles.active]: activeMenuItem === MENU_ITEMS.POINTER,
          })}
          onClick={() => handleMenuClick(MENU_ITEMS.POINTER)}
        >
          <FontAwesomeIcon icon={faArrowPointer} className={styles.icon} />
        </div>
        <div
          className={cx(styles.iconWrapper, {
            [styles.active]: activeMenuItem === MENU_ITEMS.PENCIL,
          })}
          onClick={() => handleMenuClick(MENU_ITEMS.PENCIL)}
        >
          <FontAwesomeIcon icon={faPencil} className={styles.icon} />
        </div>
        <div
          className={cx(styles.iconWrapper, {
            [styles.active]: activeMenuItem === MENU_ITEMS.SQUARE,
          })}
          onClick={() => handleMenuClick(MENU_ITEMS.SQUARE)}
        >
          <FontAwesomeIcon icon={faSquare} className={styles.icon} />
        </div>
        <div
          className={cx(styles.iconWrapper, {
            [styles.active]: activeMenuItem === MENU_ITEMS.CIRCLE,
          })}
          onClick={() => handleMenuClick(MENU_ITEMS.CIRCLE)}
        >
          <FontAwesomeIcon icon={faCircle} className={styles.icon} />
        </div>
      </div>
      <div className={styles.menuUtilityContainer}>
        <div
          className={styles.iconWrapper}
          onClick={() => handleActioItemClick(MENU_ITEMS.UNDO)}
        >
          <FontAwesomeIcon icon={faRotateLeft} className={styles.icon} />
        </div>
        <div
          className={styles.iconWrapper}
          onClick={() => handleActioItemClick(MENU_ITEMS.REDO)}
        >
          <FontAwesomeIcon icon={faRotateRight} className={styles.icon} />
        </div>
        <div
          className={styles.iconWrapper}
          onClick={() => handleActioItemClick(MENU_ITEMS.DOWNLOAD)}
        >
          <FontAwesomeIcon icon={faFileArrowDown} className={styles.icon} />
        </div>
      </div>
    </div>
    {activeMenuItem === MENU_ITEMS.PENCIL && <PenSubMenu />}
    {(activeSubmenuItem === SUB_MENU_ITEMS.PENCIL || activeSubmenuItem === SUB_MENU_ITEMS.HIGHLIGHTER ) && <Toolbox />}
    </>
  );
};

export default Menu;
