export var basicConstant = {
  VIEWSTATE_NEW: 'NEW',
  VIEWSTATE_VIEW: 'VIEW',
  VIEWSTATE_MODIFY: 'MODIFY',
  VIEWSTATE_NULL: 'NULL',

  FORMTYPE_FORM: 'FORM',
  FORMTYPE_BASE: 'BASEFORM',
  FORMTYPE_LIST: 'LISTFORM',
  FORMTYPE_SELECT: 'SELECTFORM',
  FORMTYPE_COMMAND: 'COMMONDFORM',
  FORMTYPE_DETAIL: 'DETAILFORM',

  CMP_COMPONENTSET: 'ComponentSet',
  CMP_COMPONENTSET_DB: 'DBComponentSet',
  CMP_COMPONENTSET_DO: 'DOComponentSet',

  CMP_TABSET: 'TabSet',

  CMP_TOOLBAR: 'Toolbar',
  CMP_REMOTECOMBOX: 'RemoteComboBox',
  CMP_BUTTON: 'Button',
  CMP_PANEL: 'Panel',
  CMP_TREE: 'Tree'
  // DEPENDENCE_VALUE: 'VALUE',
  // DEPENDENCE_ENABLE: 'ENABLE',
  // DEPENDENCE_EDITABLE: 'EDITABLE',
  // DEPENDENCE_READONLY: 'READONLY',
  // DEPENDENCE_REQUIRED: 'REQUIRED',
  // DEPENDENCE_UNIQUE: 'UNIQUE',
  // DEPENDENCE_HIDDEN: 'HIDDEN'
}

export var DbConstant = {
  MYSQL: 'mysql',
  ORACLE: 'oracle'
}

export var SmartViewEnv = {
  DB_DIALECT: DbConstant.MYSQL, // 标记当前数据库，供拼SQL时不同处理
  CACHE_FORM_META: false // 是否缓存formMeta , 开发环境要设置为 false
}

export var DefaultActionMethod = {
  ListQueryRootNodeMethod: 'loadRootNode', // 标记当前数据库，供拼SQL时不同处理
  ListQueryLeafNodeMethod: 'loadLeafNodes', // 是否缓存formMeta , 开发环境要设置为 false
  listQueryByTreeNode: 'listQueryByTreeNode',
  listQuery: 'listQuery'
}
