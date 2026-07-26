# <font style="color:rgb(32, 32, 32);background-color:rgb(250, 250, 253);">Newtonsoft.Json</font>
## 反序列化陷阱
如代码所示：当一个Class中，采用如下方案重写getter和setter后，当采用Newtonsoft.Json进行反序列化时，会掉入Newtonsoft.Json的反序列化陷阱：

Newtonsoft.Json对集合的反序列化流程为：

1. 先通过getter拿到“现有集合”
2. 如果“现有集合”为null，则对集合进行反序列化并填充数据
3. 如果“现有集合”不为空，则跳过

因此对代码块所示程序，getter时因拿到的都是new ()，永不为null，所以反序列化会得不到结果。

```csharp
List<TaskAnalysisAll_WorkSaturation> _deptWorkSaturations { get; set; } = new();


public List<TaskAnalysisAll_WorkSaturation> deptWorkSaturations
{
    get
    {
        if (_deptWorkSaturations.IsEmpty()) return new();
        return _deptWorkSaturations.OrderBy(t => t.OrgName).ToList();
    }
    set
    {
        _deptWorkSaturations = value;
    }
}
```

修改方案也非常简单：

```csharp
List<TaskAnalysisAll_WorkSaturation> _deptWorkSaturations { get; set; } = new();

# 增加反序列化标志，强制反序列化时使用setter替换，不检查getter是否为空
[JsonProperty(ObjectCreationHandling = ObjectCreationHandling.Replace)]
public List<TaskAnalysisAll_WorkSaturation> deptWorkSaturations
{
    get
    {
        if (_deptWorkSaturations.IsEmpty()) return new();
        return _deptWorkSaturations.OrderBy(t => t.OrgName).ToList();
    }
    set
    {
        _deptWorkSaturations = value;
    }
}
```



<font style="color:#DF2A3F;">注意，这里有坑2：getter返回的是OrderBy排序后的新的列表，导致deptWorkSaturations.Add/AddRange会作用在临时表上，因此Add/AddRange失效，应调整为：</font>

```csharp

List<TaskAnalysisAll_WorkSaturation> _deptWorkSaturations { get; set; } = new();
/// <summary>
/// 工作饱和度
/// </summary>
[JsonProperty(ObjectCreationHandling = ObjectCreationHandling.Replace)]
public List<TaskAnalysisAll_WorkSaturation> deptWorkSaturations
{
    get => _deptWorkSaturations;
    set => _deptWorkSaturations = value?.OrderBy(t => t.OrgName).ToList() ?? new();
}
```
