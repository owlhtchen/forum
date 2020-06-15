import React, {Component} from 'react';
import {NavLink} from "react-router-dom";

class NavLinkTooltip extends Component {
    render() {
        let { text, tooltip, children, to} = this.props;

        return (
            <div className="nav-div">
                <NavLink to={{...to}} className="nav-div__link">
                    {children}
                    <span>{text}</span>
                </NavLink>
                {tooltip &&
                <div className="nav-div__tooltip">
                    <span>{tooltip}</span>
                </div>
                }
            </div>
        );
    }
}

export default NavLinkTooltip;