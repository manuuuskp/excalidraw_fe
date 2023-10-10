import cx from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import {
  faPencil,
  faEraser,
  faXmark,
  faHighlighter,
} from "@fortawesome/free-solid-svg-icons";
import { MENU_ITEMS, SUB_MENU_ITEMS } from "@/constants";
import { subMenuItemClick } from "@/slice/menuSlice";

import styles from "./penSubMenu.module.css";

const PenSubMenu = () => {
  const dispatch = useDispatch();
  const activeMenuItem = useSelector((state) => state.menu.activeSubMenuItem);
  const activeMenuToolbox = useSelector((state) => state.toolbox[activeMenuItem]);
  const handleSubMenuClick = (itemName) => {
    dispatch(subMenuItemClick(itemName));
  };
  return (
    <div className={styles.menuContainer}>
      <div className={styles.menuToolsContainer}>
        <div
          className={cx(styles.iconWrapper, {
            [styles.active]: activeMenuItem === SUB_MENU_ITEMS.CLOSE,
          })}
          onClick={() => handleSubMenuClick(SUB_MENU_ITEMS.CLOSE)}
        >
          <FontAwesomeIcon icon={faXmark} className={styles.icon} />
        </div>
        <hr />
        <div
          className={cx(styles.iconWrapper, {
            [styles.active]: activeMenuItem === SUB_MENU_ITEMS.PENCIL,
          })}
          onClick={() => handleSubMenuClick(SUB_MENU_ITEMS.PENCIL)}
        >
          <FontAwesomeIcon icon={faPencil} className={styles.icon} />
        </div>
        <div
          className={cx(styles.iconWrapper, {
            [styles.active]: activeMenuItem === SUB_MENU_ITEMS.HIGHLIGHTER,
          })}
          onClick={() => handleSubMenuClick(SUB_MENU_ITEMS.HIGHLIGHTER)}
        >
          <FontAwesomeIcon icon={faHighlighter} className={styles.icon} />
        </div>
        <div
          className={cx(styles.iconWrapper, {
            [styles.active]: activeMenuItem === SUB_MENU_ITEMS.ERASER,
          })}
          onClick={() => handleSubMenuClick(SUB_MENU_ITEMS.ERASER)}
        >
          <FontAwesomeIcon icon={faEraser} className={styles.icon} />
        </div>
        <hr />
        <div className={styles.colorOuter}>
          <div style={{width: '25px', height: '25px', borderRadius: '50%', backgroundColor: `${activeMenuToolbox?.color}`}}></div>
        </div>
      </div>
    </div>
  );
};

export default PenSubMenu;
