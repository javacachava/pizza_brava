import { MenuRepository } from '../../repos/implementations/MenuRepository';
import { CategoryRepository } from '../../repos/implementations/CategoryRepository';
import { ComboDefinitionRepository } from '../../repos/implementations/ComboDefinitionRepository';
import { ComboRepository } from '../../repos/implementations/ComboRepository';
import { OrdersRepository } from '../../repos/implementations/OrdersRepository';
import { SizesRepository } from '../../repos/implementations/SizesRepository';
import { FlavorsRepository } from '../../repos/implementations/FlavorsRepository';
import { IngredientRepository } from '../../repos/implementations/IngredientRepository';
import { OptionRepository } from '../../repos/implementations/OptionRepository';
import { TablesRepository } from '../../repos/implementations/TablesRepository';
import { UsersRepository } from '../../repos/implementations/UsersRepository';
import { CashFlowRepository } from '../../repos/implementations/CashFlowRepository';
import { SystemInfoRepository } from '../../repos/implementations/SystemInfoRepository';
import { RulesRepository } from '../../repos/implementations/RulesRepository';

import { MenuService } from '../../services/domain/MenuService';
import { ComboService } from '../../services/domain/ComboService';
import { OrdersService } from '../../services/domain/OrdersService';
import { KitchenService } from '../../services/domain/KitchenService';
import { CashService } from '../../services/domain/CashService';
import { POSService } from '../../services/domain/POSService';
import { ProductsAdminService } from '../../services/domain/ProductsAdminService';
import { UsersAdminService } from '../../services/domain/UsersAdminService';
import { ReportsService } from '../../services/domain/ReportsService';
import { AdminService } from '../../services/domain/AdminService';
import { AuthService } from '../../services/auth/AuthService';

export const container = {
  menuRepo: new MenuRepository(),
  categoryRepo: new CategoryRepository(),
  comboDefRepo: new ComboDefinitionRepository(),
  comboInstRepo: new ComboRepository(),
  ordersRepo: new OrdersRepository(),
  sizesRepo: new SizesRepository(),
  flavorsRepo: new FlavorsRepository(),
  ingredientsRepo: new IngredientRepository(),
  optionsRepo: new OptionRepository(),
  tablesRepo: new TablesRepository(),
  usersRepo: new UsersRepository(),
  cashFlowRepo: new CashFlowRepository(),
  systemSettingsRepo: new SystemInfoRepository(),
  rulesRepo: new RulesRepository(),

  menuService: null as any,
  comboService: null as any,
  ordersService: null as any,
  kitchenService: null as any,
  cashService: null as any,
  posService: new POSService(),
  productsAdminService: null as any,
  usersAdminService: null as any,
  reportsService: null as any,
  adminService: null as any,
  authService: null as any,
};

container.menuService = new MenuService(
  container.menuRepo,
  container.categoryRepo
);

container.comboService = new ComboService(
  container.comboInstRepo,
  container.comboDefRepo
);

container.ordersService = new OrdersService(container.ordersRepo);

container.kitchenService = new KitchenService(container.ordersRepo);

container.cashService = new CashService(container.cashFlowRepo);

container.productsAdminService = new ProductsAdminService(container.menuRepo);

container.usersAdminService = new UsersAdminService(container.usersRepo);

container.reportsService = new ReportsService(container.ordersRepo);

container.adminService = new AdminService(
  container.systemSettingsRepo,
  container.rulesRepo
);

container.authService = new AuthService(container.usersRepo);

export type AppContainer = typeof container;
