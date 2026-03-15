import { useState, useEffect } from 'react';
import { 
  Building2, Briefcase, Plus, Loader2, Edit3, Trash2, 
  MapPin, Settings, ServerCrash, Save, ChevronDown, ChevronUp
} from 'lucide-react';
import api from '../../services/api';

const AdminMasterDataPage = () => {
  const [selectedSector, setSelectedSector] = useState('Railway');
  const [activeTab, setActiveTab] = useState('zones'); // 'zones' | 'departments'
  
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [zones, setZones] = useState([]);
  const [departments, setDepartments] = useState([]);
  
  const [editingItem, setEditingItem] = useState(null); // Full object when editing
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [expandedId, setExpandedId] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [zonesRes, deptsRes] = await Promise.all([
        api.get('/master-data/zones'),
        api.get('/master-data/departments')
      ]);
      setZones(zonesRes.data);
      setDepartments(deptsRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSeed = async () => {
    if(!window.confirm("This will overwrite existing Master Data with the legacy static files. Continue?")) return;
    try {
      setSeeding(true);
      await api.post('/master-data/seed');
      await fetchData();
    } catch (error) {
      alert("Failed to seed data");
    } finally {
      setSeeding(false);
    }
  };

  const handleDelete = async (id, isZone) => {
    if(!window.confirm("Are you sure you want to delete this master record? This may break existing transfers that rely on it.")) return;
    try {
      const endpoint = isZone ? `/master-data/zones/${id}` : `/master-data/departments/${id}`;
      await api.delete(endpoint);
      if (isZone) setZones(prev => prev.filter(z => z._id !== id));
      else setDepartments(prev => prev.filter(d => d._id !== id));
    } catch (error) {
      alert("Deletion failed");
    }
  };

  const openAddModal = () => {
    if (activeTab === 'zones') {
      setEditingItem({ _id: null, name: '', code: '', divisions: [] });
    } else {
      setEditingItem({ _id: null, name: '', subDepartments: [] });
    }
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(JSON.parse(JSON.stringify(item))); // Deep copy
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const isZone = activeTab === 'zones';
      const endpoint = isZone ? '/master-data/zones' : '/master-data/departments';
      
      let res;
      if (editingItem._id) {
        res = await api.put(`${endpoint}/${editingItem._id}`, editingItem);
      } else {
        res = await api.post(endpoint, editingItem);
      }

      await fetchData();
      setIsModalOpen(false);
    } catch (error) {
      alert("Error saving: " + (error.response?.data?.message || error.message));
    } finally {
      setSaving(false);
    }
  };

  // UI Handlers for deeply nested state
  const addSubItem = () => {
    if (activeTab === 'zones') {
      setEditingItem(prev => ({
        ...prev,
        divisions: [...prev.divisions, { name: '', stations: [] }]
      }));
    } else {
      setEditingItem(prev => ({
        ...prev,
        subDepartments: [...prev.subDepartments, { name: '', designations: [] }]
      }));
    }
  };

  const updateSubItemName = (index, val) => {
    setEditingItem(prev => {
      const copy = { ...prev };
      if (activeTab === 'zones') copy.divisions[index].name = val;
      else copy.subDepartments[index].name = val;
      return copy;
    });
  };

  const updateSubItemList = (index, val) => {
    // String from textarea -> convert to array
    const arr = val.split(',').map(s => s.trim()).filter(Boolean);
    setEditingItem(prev => {
      const copy = { ...prev };
      if (activeTab === 'zones') copy.divisions[index].stations = arr;
      else copy.subDepartments[index].designations = arr;
      return copy;
    });
  };

  const removeSubItem = (index) => {
    setEditingItem(prev => {
      const copy = { ...prev };
      if (activeTab === 'zones') copy.divisions.splice(index, 1);
      else copy.subDepartments.splice(index, 1);
      return copy;
    });
  };

  if (loading && zones.length === 0) {
    return (
      <div className="flex justify-center items-center h-full min-h-[50vh]">
        <Loader2 className="h-10 w-10 text-slate-300 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto animate-fade-in relative pb-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Settings className="h-8 w-8 text-primary-600" />
            Master Data
          </h1>
          <p className="text-slate-500 font-medium text-sm mt-1">
            Manage the Regions, Zones, Divisions, and Department designations that power the portal.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Working Sector:</label>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="bg-white border border-slate-200 text-slate-900 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm font-bold shadow-sm appearance-none"
            >
              <option value="Railway">Indian Railways</option>
              <option value="Medical">Medical Providers</option>
              <option value="Education">Education / Teachers</option>
              <option value="Defense">Defense / Paramilitary</option>
              <option value="Banking">Banking Sector</option>
            </select>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {selectedSector === 'Railway' && (zones.length === 0 || departments.length === 0) && (
            <button
              onClick={handleSeed}
              disabled={seeding}
              className="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 hover:bg-amber-200 rounded-xl font-bold text-sm transition-all"
            >
              {seeding ? <Loader2 className="h-4 w-4 animate-spin" /> : <ServerCrash className="h-4 w-4" />}
              {seeding ? 'Seeding...' : 'Seed Data from Static Files'}
            </button>
          )}

          <button
            onClick={openAddModal}
            disabled={selectedSector !== 'Railway'}
            className="flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-5 py-2.5 rounded-xl font-black text-sm shadow-xl shadow-slate-900/10 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="h-4 w-4" />
            Add {activeTab === 'zones' ? 'Zone' : 'Department'}
          </button>
        </div>
      </div>

      {selectedSector !== 'Railway' ? (
        <div className="bg-slate-50/50 rounded-[2rem] border border-slate-200 p-16 text-center mt-8 shadow-inner">
          <div className="h-16 w-16 bg-white border border-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
            <ServerCrash className="h-8 w-8 text-slate-300" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-2">Sector Integration Pending</h3>
          <p className="text-slate-500 max-w-md mx-auto font-medium">
            Master Data schemas for the <span className="font-bold text-slate-700">{selectedSector}</span> sector are currently under active development. You will be able to manage this soon.
          </p>
        </div>
      ) : (
        <>
          {/* Tabs */}
          <div className="flex items-center gap-6 border-b border-slate-200 mb-8">
            <button
              onClick={() => setActiveTab('zones')}
              className={`pb-4 text-sm font-black transition-colors relative ${
                activeTab === 'zones' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Building2 className="h-4 w-4 inline-block mr-2" />
              Zones & Regions
            </button>
            <button
              onClick={() => setActiveTab('departments')}
              className={`pb-4 text-sm font-black transition-colors relative ${
                activeTab === 'departments' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Briefcase className="h-4 w-4 inline-block mr-2" />
              Departments
            </button>
          </div>

          {/* Lists */}
          <div className="space-y-4">
            {activeTab === 'zones' && zones.map(zone => (
              <div key={zone._id} className="bg-white border text-left border-slate-200 rounded-[1.25rem] shadow-sm overflow-hidden transition-all hover:shadow-md">
                <div className="flex justify-between items-center p-5 cursor-pointer user-select-none" onClick={() => setExpandedId(expandedId === zone._id ? null : zone._id)}>
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-primary-50 rounded-xl text-primary-600 flex items-center justify-center font-black">
                      {zone.code}
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-900 leading-tight">{zone.name}</h3>
                      <p className="text-xs font-bold text-slate-400 mt-0.5">{zone.divisions?.length || 0} Divisions</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={(e) => { e.stopPropagation(); openEditModal(zone); }} className="p-2 text-slate-400 hover:text-primary-600 bg-slate-50 hover:bg-primary-50 rounded-lg transition-colors">
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(zone._id, true); }} className="p-2 text-slate-400 hover:text-red-600 bg-slate-50 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                    {expandedId === zone._id ? <ChevronUp className="h-5 w-5 text-slate-400 ml-2" /> : <ChevronDown className="h-5 w-5 text-slate-400 ml-2" />}
                  </div>
                </div>
                
                {/* Expanded Content */}
                {expandedId === zone._id && (
                  <div className="px-5 pb-5 pt-2 bg-slate-50/50 border-t border-slate-100 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {zone.divisions?.map((div, i) => (
                        <div key={i} className="bg-white p-4 rounded-xl border border-slate-200">
                          <p className="font-bold text-slate-900 flex items-center gap-2 mb-2">
                            <MapPin className="h-3 w-3 text-red-500" />
                            {div.name}
                          </p>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {div.stations?.slice(0, 10).map((st, j) => (
                              <span key={j} className="text-[9px] font-black uppercase text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                                {st}
                              </span>
                            ))}
                            {div.stations?.length > 10 && <span className="text-[9px] font-bold text-slate-400">+{div.stations.length - 10} more</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {activeTab === 'departments' && departments.map(dept => (
              <div key={dept._id} className="bg-white border text-left border-slate-200 rounded-[1.25rem] shadow-sm overflow-hidden transition-all hover:shadow-md">
                <div className="flex justify-between items-center p-5 cursor-pointer user-select-none" onClick={() => setExpandedId(expandedId === dept._id ? null : dept._id)}>
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-amber-50 rounded-xl text-amber-600 flex items-center justify-center">
                      <Briefcase className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-900 leading-tight">{dept.name}</h3>
                      <p className="text-xs font-bold text-slate-400 mt-0.5">{dept.subDepartments?.length || 0} Sub-departments</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={(e) => { e.stopPropagation(); openEditModal(dept); }} className="p-2 text-slate-400 hover:text-primary-600 bg-slate-50 hover:bg-primary-50 rounded-lg transition-colors">
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(dept._id, false); }} className="p-2 text-slate-400 hover:text-red-600 bg-slate-50 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                    {expandedId === dept._id ? <ChevronUp className="h-5 w-5 text-slate-400 ml-2" /> : <ChevronDown className="h-5 w-5 text-slate-400 ml-2" />}
                  </div>
                </div>
                
                {/* Expanded Content */}
                {expandedId === dept._id && (
                  <div className="px-5 pb-5 pt-2 bg-slate-50/50 border-t border-slate-100 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {dept.subDepartments?.map((sub, i) => (
                        <div key={i} className="bg-white p-4 rounded-xl border border-slate-200">
                          <p className="font-bold text-slate-900 mb-2 truncate">
                            {sub.name}
                          </p>
                          <div className="flex flex-col gap-1.5 mt-2">
                            {sub.designations?.slice(0, 5).map((desig, j) => (
                              <div key={j} className="text-xs font-medium text-slate-600 truncate border-l-2 border-slate-200 pl-2">
                                {desig}
                              </div>
                            ))}
                            {sub.designations?.length > 5 && <span className="text-[10px] font-bold text-slate-400 pl-2">+{sub.designations.length - 5} more roles</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Editor Modal */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          
          {/* Editor Panel */}
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col relative z-10 animate-fade-in-up">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-900">
                {editingItem._id ? 'Edit' : 'Add'} {activeTab === 'zones' ? 'Zone' : 'Department'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-900 text-sm font-bold bg-slate-100 px-3 py-1.5 rounded-lg">Close</button>
            </div>
            
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Name</label>
                  <input
                    required
                    type="text"
                    value={editingItem.name}
                    onChange={e => setEditingItem({...editingItem, name: e.target.value})}
                    placeholder={activeTab === 'zones' ? "e.g. Northern Railway" : "e.g. Engineering"}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm font-bold"
                  />
                </div>

                {activeTab === 'zones' && (
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Code / Alias</label>
                    <input
                      required
                      type="text"
                      value={editingItem.code || ''}
                      onChange={e => setEditingItem({...editingItem, code: e.target.value.toUpperCase()})}
                      placeholder="e.g. NR"
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm font-bold"
                    />
                  </div>
                )}
              </div>
              
              <div className="mt-8 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="font-black text-slate-700">
                    {activeTab === 'zones' ? 'Divisions & Stations' : 'Sub-departments & Designations'}
                  </h3>
                  <button type="button" onClick={addSubItem} className="text-xs font-bold text-primary-600 hover:text-primary-700 bg-primary-50 px-2.5 py-1.5 rounded-lg flex items-center gap-1">
                    <Plus className="h-3 w-3" /> Add Row
                  </button>
                </div>
                
                {/* Dynamically render Sub-items */}
                {(activeTab === 'zones' ? editingItem.divisions : editingItem.subDepartments)?.map((sub, index) => (
                  <div key={index} className="bg-slate-50 rounded-xl p-4 border border-slate-100 relative group">
                    <button type="button" onClick={() => removeSubItem(index)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                    
                    <div className="space-y-4 pr-8">
                      <input
                        required
                        type="text"
                        value={sub.name}
                        onChange={e => updateSubItemName(index, e.target.value)}
                        placeholder={`Name of ${activeTab === 'zones' ? 'Division' : 'Sub-department'}`}
                        className="w-full bg-white border border-slate-200 text-slate-900 rounded-lg px-3 py-2 text-sm font-bold outline-none"
                      />
                      <div>
                        <p className="text-[10px] font-black uppercase text-slate-400 mb-1 ml-1">
                          {activeTab === 'zones' ? 'Stations (Comma separated)' : 'Designations (Comma separated)'}
                        </p>
                        <textarea
                          rows={2}
                          value={activeTab === 'zones' ? sub.stations?.join(', ') : sub.designations?.join(', ')}
                          onChange={e => updateSubItemList(index, e.target.value)}
                          placeholder="Item 1, Item 2, Item 3..."
                          className="w-full bg-white border border-slate-200 text-slate-700 rounded-lg px-3 py-2 text-sm outline-none resize-y"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </form>
            
            <div className="p-6 border-t border-slate-100 bg-slate-50/50 rounded-b-[2rem]">
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full flex justify-center items-center gap-2 bg-slate-900 hover:bg-black text-white px-5 py-3.5 rounded-xl font-black shadow-lg shadow-slate-900/10 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 text-slate-400" />}
                {saving ? 'Saving...' : 'Save Data'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMasterDataPage;
