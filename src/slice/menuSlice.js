import { createSlice } from '@reduxjs/toolkit'
import { MENU_ITEMS } from '@/constants'

const initialState = {
    activeMenuItem: MENU_ITEMS.PENCIL,
    actionMenuItem: null,
    activeSubMenuItem: null
}

export const menuSlice = createSlice({
    name: 'menu',
    initialState,
    reducers: {
        menuItemClick: (state, action) => {
            state.activeMenuItem = action.payload;
            console.log('menu', state.activeMenuItem);
        },
        actionItemClick: (state, action) => {
            state.actionMenuItem = action.payload;
            console.log('actionItem', state.actionMenuItem);
        },
        subMenuItemClick: (state, action) => {
            state.activeSubMenuItem = action.payload;
            console.log('submenu', state.activeSubMenuItem);
        }
    }
});

export const {menuItemClick, actionItemClick, subMenuItemClick} = menuSlice.actions

export default menuSlice.reducer