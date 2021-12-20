import {
  Button,
  Dialog,
  Form,
  Input,
  InputNumber,
  Message,
  Pagination,
  Select,
  Table,
  Upload,
} from 'element-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import {
  getFoods,
  getFoodsCount,
  deleteFood,
  getResturantDetail,
  getMenuById,
  getMenu,
  updateFood,
} from '../../api/getData';
import './foodList.css';

function usePagination() {
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(20);

  useEffect(() => {
    (async function getData() {
      const countData = await getFoodsCount();
      if (countData.status === 1) {
        setCount(countData.count);
      } else {
        throw new Error('获取数据失败');
      }
    })();
  }, []);

  return [count, limit, currentPage, setCurrentPage];
}

function Operation({ itemId: id, handleEdit }) {
  const handleDelete = async () => {
    const res = await deleteFood(id);

    if (res.status === 1) {
      Message({
        message: '删除食品成功',
        type: 'success',
      });
      // 重新获取总数, 数据
    } else {
      Message.error(res.message);
    }
  };

  return (
    <span>
      <Button size='small' onClick={() => handleEdit(id)}>
        编辑
      </Button>
      <Button size='small' type='danger' onClick={handleDelete}>
        删除
      </Button>
    </span>
  );
}

const specsRules = {
  specs_name: [{ required: true, message: '请输入规格', trigger: 'blur' }],
};

function FoodSpecif({ specfoods, deleteSpecs, addSpecs }) {
  const columns = [
    {
      label: '规格',
      prop: 'specs_name',
    },
    {
      label: '包装费',
      prop: 'packing_fee',
    },
    {
      label: '价格',
      prop: 'price',
    },
    {
      label: '操作',
      render: (row, column, index) => {
        return (
          <Button size='small' type='danger' onClick={() => deleteSpecs(index)}>
            删除
          </Button>
        );
      },
    },
  ];
  const [showAddSpecs, setShowAddSpecs] = useState(false);
  const [form, setForm] = useState({
    specs_name: '',
    packing_fee: 0,
    price: 20,
  });
  const formRef = useRef(null);

  const onChange = (key, value) => {
    setForm(Object.assign({}, form, { [key]: value }));
  };
  const handleAddSpecs = (e) => {
    e.preventDefault();

    formRef?.current.validate((valid) => {
      if (valid) {
        setForm({
          specs_name: '',
          packing_fee: 0,
          price: 20,
        });
        setShowAddSpecs(false);
        addSpecs(form);
      }
    });
  };

  return (
    <>
      <Table
        style={{ width: '100%' }}
        columns={columns}
        data={specfoods}
        highlight-current-row
      />
      <div className='specs-btton'>
        <Button type='primary' onClick={() => setShowAddSpecs(true)}>
          添加规格
        </Button>
      </div>
      <Dialog
        size='small'
        title='添加规格'
        visible={showAddSpecs}
        onCancel={() => setShowAddSpecs(false)}>
        <Dialog.Body>
          <Form ref={formRef} model={form} rules={specsRules} labelWidth='120'>
            <Form.Item
              style={{ marginBottom: '22px' }}
              label='规格'
              prop='specs_name'>
              <Input
                value={form.specs_name}
                onChange={onChange.bind(this, 'specs_name')}></Input>
            </Form.Item>
            <Form.Item style={{ marginBottom: '22px' }} label='包装费'>
              <InputNumber
                defaultValue={form.packing_fee}
                onChange={onChange.bind(this, 'packing_fee')}
                min='0'
                max='100'></InputNumber>
            </Form.Item>
            <Form.Item label='价格'>
              <InputNumber
                defaultValue={form.price}
                onChange={onChange.bind(this, 'price')}
                min='0'
                max='10000'></InputNumber>
            </Form.Item>
          </Form>
        </Dialog.Body>

        <Dialog.Footer className='dialog-footer'>
          <Button onClick={() => setShowAddSpecs(false)}>取 消</Button>
          <Button type='primary' onClick={handleAddSpecs}>
            确 定
          </Button>
        </Dialog.Footer>
      </Dialog>
    </>
  );
}

const rules = {
  name: [{ required: true, message: '请输入食品名称', trigger: 'change' }],
  description: [
    { required: true, message: '请输入食品名称', trigger: 'change' },
  ],
  category_id: [
    {
      type: 'number',
      required: true,
      message: '请选择食品分类',
      trigger: 'change',
    },
  ],
  image_path: [
    { required: true, message: '请上传食品图片', trigger: 'change' },
  ],
};

function EditFood({ isEdit, editDone, editForm }) {
  const [menuOptions, setMenuOptions] = useState([]);
  const [form, setForm] = useState({});
  const formRef = useRef();

  useEffect(() => {
    if (editForm?.restaurant_id == null) return;

    setForm(JSON.parse(JSON.stringify(editForm)));

    (async function getData() {
      setMenuOptions([]);
      const menu = await getMenu({
        restaurant_id: editForm?.restaurant_id,
        allMenu: true,
      });

      setMenuOptions(
        menu.map((item, index) => ({
          index,
          value: item.id,
          label: item.name,
        }))
      );
    })();
  }, [editForm]);

  const onChange = (key, value) => {
    setForm(Object.assign({}, form, { [key]: value }));
  };
  const beforeAvatarUpload = async (file) => {
    const isRightType = file.type === 'image/jpeg' || file.type === 'image/png';
    const isLt2M = file.size / 1024 / 1024 < 2;

    if (!isRightType) {
      Message.error('上传头像图片只能是 JPG 格式!');
    }
    if (!isLt2M) {
      Message.error('上传头像图片大小不能超过 2MB!');
    }
    return isRightType && isLt2M;
  };

  const handleAvatarScucess = (res) => {
    if (res.status === 1) {
      onChange('image_path', res.image_path);
    } else {
      Message.error('上传图片失败！');
    }
  };

  const deleteSpecs = (index) => {
    const newSpecs = [...form.specfoods];
    newSpecs.splice(index, 1);

    onChange('specfoods', newSpecs);
  };

  const addSpecs = (data) => {
    const newSpecs = [...form.specfoods];
    newSpecs.push(data);

    onChange('specfoods', newSpecs);
  };

  const editSuccess = (e) => {
    e.preventDefault();

    formRef?.current.validate(async (valid) => {
      if (valid) {
        const formData = {
          ...form,
          specfoods: editForm.specfoods,
          specs: form.specfoods.map((item) => ({
            packing_fee: item.packing_fee,
            price: item.price,
            specs: item.specs,
          })),
          new_category_id: form.category_id,
          category_id: editForm.category_id,
        };

        const res = await updateFood(formData);
        if (res.status === 1) {
          editDone(true);
          Message({
            message: '更新食品信息成功',
            type: 'success',
          });
        } else {
          editDone();
          Message.error(res.message);
        }
      }
    });
  };

  if (!editForm) return null;
  return (
    <Dialog title='修改食品信息' visible={isEdit} onCancel={() => editDone()}>
      <Dialog.Body>
        <Form ref={formRef} model={form} rules={rules} labelWidth='120'>
          <Form.Item label='食品名称' prop='name'>
            <Input
              value={form.name}
              onChange={onChange.bind(this, 'name')}></Input>
          </Form.Item>
          <Form.Item label='食品介绍' prop='description'>
            <Input
              value={form.description}
              onChange={onChange.bind(this, 'description')}></Input>
          </Form.Item>
          <Form.Item label='食品分类' prop='category_id'>
            <Select
              value={form.category_id}
              placeholder='请选择食品分类'
              onChange={onChange.bind(this, 'category_id')}>
              {menuOptions &&
                menuOptions.map((item) => {
                  return (
                    <Select.Option
                      label={item.label}
                      value={item.value}
                      key={item.value}></Select.Option>
                  );
                })}
            </Select>
          </Form.Item>
          <Form.Item label='食品图片' prop='image_path'>
            <Upload
              className='avatar-uploader'
              action='/api/v1/addimg/food'
              showFileList={false}
              onSuccess={handleAvatarScucess}
              beforeUpload={beforeAvatarUpload}>
              {form.image_path ? (
                <img
                  alt=''
                  src={'/api/img/' + form.image_path}
                  className='avatar'
                />
              ) : (
                <i className='el-icon-plus avatar-uploader-icon'></i>
              )}
            </Upload>
          </Form.Item>
          <Form.Item labelWidth='0'>
            <FoodSpecif
              specfoods={form.specfoods}
              deleteSpecs={deleteSpecs}
              addSpecs={addSpecs}
            />
          </Form.Item>
        </Form>
      </Dialog.Body>

      <Dialog.Footer className='dialog-footer'>
        <Button onClick={() => editDone()}>取 消</Button>
        <Button type='primary' onClick={editSuccess}>
          确 定
        </Button>
      </Dialog.Footer>
    </Dialog>
  );
}

export default function FoodList() {
  const columns = [
    {
      type: 'expand',
      expandPannel: function (data) {
        return (
          <Form
            labelPosition='left'
            inline={true}
            className='demo-table-expand'>
            <Form.Item label='食品名称'>
              <span>{data.name}</span>
            </Form.Item>
            <Form.Item label='餐馆名称'>
              <span>{data.restaurant_name}</span>
            </Form.Item>
            <Form.Item label='食品 ID'>
              <span>{data.item_id}</span>
            </Form.Item>
            <Form.Item label='餐馆 ID'>
              <span>{data.restaurant_id}</span>
            </Form.Item>
            <Form.Item label='食品介绍'>
              <span>{data.description}</span>
            </Form.Item>
            <Form.Item label='餐馆地址'>
              <span>{data.restaurant_address}</span>
            </Form.Item>
            <Form.Item label='食品评分'>
              <span>{data.rating}</span>
            </Form.Item>
            <Form.Item label='食品分类'>
              <span>{data.category_name}</span>
            </Form.Item>
            <Form.Item label='月销量'>
              <span>{data.month_sales}</span>
            </Form.Item>
          </Form>
        );
      },
    },
    {
      label: '食品名称',
      prop: 'name',
    },
    {
      label: '食品介绍',
      prop: 'description',
    },
    {
      label: '评分',
      prop: 'rating',
    },
    {
      label: '操作',
      width: 160,
      render: (row, column, index) => {
        return (
          <Operation
            itemId={row.item_id}
            handleEdit={handleEdit.bind(null, row)}
          />
        );
      },
    },
  ];
  const [data, setData] = useState([]);
  const [count, limit, currentPage, setCurrentPage] = usePagination();
  const [isEdit, setIsEdit] = useState(false);
  const [editForm, setEditForm] = useState(null);

  const handleEdit = useCallback(async (row, id) => {
    const restaurant = await getResturantDetail(row.restaurant_id);
    const category = await getMenuById(row.category_id);

    setEditForm({
      ...row,
      restaurant_name: restaurant.name,
      restaurant_address: restaurant.address,
      category_name: category.name,
    });
    setIsEdit(true);
  }, []);
  const getData = useCallback(() => {
    (async function () {
      const data = await getFoods({
        offset: (currentPage - 1) * limit,
        limit,
      });

      setData(
        data.map((item) => ({
          name: item.name,
          item_id: item.item_id,
          description: item.description,
          rating: item.rating,
          month_sales: item.month_sales,
          restaurant_id: item.restaurant_id,
          category_id: item.category_id,
          image_path: item.image_path,
          specfoods: item.specfoods,
          index: item.index,
        }))
      );
    })();
  }, [currentPage, limit]);
  const editDone = useCallback(
    (flag) => {
      if (flag) {
        // 更新数据
        getData();
      }

      setIsEdit(false);
    },
    [getData]
  );

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <div className='tabel_container'>
      <Table
        style={{ width: '100%' }}
        columns={columns}
        data={data}
        highlight-current-row
      />
      <div style={{ textAlign: 'left', marginTop: '20px' }}>
        <Pagination
          layout='total, prev, pager, next'
          total={count}
          pageSize={20}
          currentPage={currentPage}
          onCurrentChange={(val) => setCurrentPage(val)}
        />
      </div>

      <EditFood isEdit={isEdit} editDone={editDone} editForm={editForm} />
    </div>
  );
}
