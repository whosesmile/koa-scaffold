var path = require('path');
var Sequelize = require('sequelize');

// 初始化数据库
var sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
  storage: path.resolve(__dirname, '../workflow.db')
});

// 工单记录
var Work = sequelize.define('work', {
  type: {
    type: Sequelize.STRING
  },
  title: {
    type: Sequelize.STRING
  },
  subtitle: {
    type: Sequelize.STRING
  },
  papers: {
    type: Sequelize.STRING
  },
  example: {
    type: Sequelize.STRING
  },
  scene: {
    type: Sequelize.STRING
  },
  deploy: {
    type: Sequelize.STRING
  },
  date: {
    type: Sequelize.STRING
  },
  remark: {
    type: Sequelize.STRING
  },
});

var Material = sequelize.define('material', {
  name: {
    type: Sequelize.STRING
  }
});

// 如果单独运行 则重建表结构
if (require.main === module) {
  // 创建表
  Work.sync({
    force: true
  });

  Material.sync({
    force: true
  }).then(function () {
    Material.create({
      name: 'APP图片'
    });
    Material.create({
      name: 'APP二维码'
    });
    Material.create({
      name: '微信二维码'
    });
    Material.create({
      name: '电话号码 <span class="text-muted">(请在文案内容内填电话号码)</span>'
    });
  });
}
// 对外模型
exports.Work = Work;