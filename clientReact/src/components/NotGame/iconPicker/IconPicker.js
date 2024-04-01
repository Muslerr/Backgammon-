// IconPicker.js
import React from "react";
import style from "./iconPicker.module.css"; // Import the CSS for IconPicker

function IconPicker({ icons, selectedIcon, onSelectIcon }) {
  return (
    <div className={style.iconPicker}>
      {icons.map((icon) => (
        <div
          key={icon}
          className={`${style.iconItem} ${selectedIcon === icon ? style.selectedIcon : ""}`}
          onClick={() => onSelectIcon(icon)}
        >
          <img src={`icons/${icon}`} alt={icon} className={style.iconImage} />
        </div>
      ))}
    </div>
  );
}

export default IconPicker;
