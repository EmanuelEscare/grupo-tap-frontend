export interface NavItem {
  key: string;
  label: string;
  route: string;
  icon: string;
}

export const NAV_ITEMS: NavItem[] = [
  { key: 'products', label: 'Productos', route: '/products', icon: 'inventory_2' },
  { key: 'users', label: 'Usuarios', route: '/users', icon: 'group' },
  { key: 'profiles', label: 'Perfiles', route: '/profiles', icon: 'badge' },
  { key: 'sections', label: 'Secciones', route: '/sections', icon: 'view_list' },
];
