
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, ChefHat, Star, Search } from 'lucide-react';
import useStore from '@/store/useStore';
import { useToast } from '@/hooks/use-toast';

const MenuManagement: React.FC = () => {
  const { menuItems, categories, addMenuItem, updateMenuItem, deleteMenuItem, addCategory, updateCategory, deleteCategory } = useStore();
  const { toast } = useToast();
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'items' | 'categories'>('items');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    images: [''],
    preparationTime: 15,
    featured: false,
    available: true,
    ingredients: '',
    dietary: ''
  });

  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    description: '',
    image: '/placeholder.svg'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const itemData = {
      ...formData,
      images: formData.images.filter(img => img.trim() !== ''),
      ingredients: formData.ingredients.split(',').map(i => i.trim()).filter(Boolean),
      dietary: formData.dietary.split(',').map(d => d.trim()).filter(Boolean)
    };
    
    if (editingItem) {
      updateMenuItem(editingItem.id, itemData);
      toast({
        title: "Article modifié",
        description: "L'article du menu a été modifié avec succès.",
      });
    } else {
      addMenuItem(itemData);
      toast({
        title: "Article créé",
        description: "Nouvel article du menu créé avec succès.",
      });
    }
    
    resetForm();
  };

  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingCategory) {
      updateCategory(editingCategory.id, categoryFormData);
      toast({
        title: "Catégorie modifiée",
        description: "La catégorie a été modifiée avec succès.",
      });
    } else {
      addCategory(categoryFormData);
      toast({
        title: "Catégorie créée",
        description: "Nouvelle catégorie créée avec succès.",
      });
    }
    
    resetCategoryForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      category: '',
      images: [''],
      preparationTime: 15,
      featured: false,
      available: true,
      ingredients: '',
      dietary: ''
    });
    setEditingItem(null);
  };

  const resetCategoryForm = () => {
    setCategoryFormData({
      name: '',
      description: '',
      image: '/placeholder.svg'
    });
    setEditingCategory(null);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      images: item.images || [''],
      preparationTime: item.preparationTime || 15,
      featured: item.featured || false,
      available: item.available !== undefined ? item.available : true,
      ingredients: item.ingredients?.join(', ') || '',
      dietary: item.dietary?.join(', ') || ''
    });
  };

  const handleEditCategory = (category: any) => {
    setEditingCategory(category);
    setCategoryFormData({
      name: category.name,
      description: category.description,
      image: category.image
    });
  };

  const handleDelete = (itemId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet article du menu ?')) {
      deleteMenuItem(itemId);
      toast({
        title: "Article supprimé",
        description: "L'article du menu a été supprimé avec succès.",
      });
    }
  };

  const handleDeleteCategory = (categoryId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      deleteCategory(categoryId);
      toast({
        title: "Catégorie supprimée",
        description: "La catégorie a été supprimée avec succès.",
      });
    }
  };

  const addImageField = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, '']
    }));
  };

  const updateImageField = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => i === index ? value : img)
    }));
  };

  const removeImageField = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const uniqueCategories = [...new Set(menuItems.map(item => item.category))];

  // Filter menu items based on search and category
  const filteredMenuItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Gestion du Menu
        </h2>
        <div className="flex space-x-2">
          <Button 
            variant={activeTab === 'items' ? 'default' : 'outline'}
            onClick={() => setActiveTab('items')}
          >
            Articles du Menu
          </Button>
          <Button 
            variant={activeTab === 'categories' ? 'default' : 'outline'}
            onClick={() => setActiveTab('categories')}
          >
            Catégories
          </Button>
        </div>
      </div>

      {activeTab === 'items' && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle>
                {editingItem ? 'Modifier l\'Article' : 'Créer un Nouvel Article'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nom</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Prix (€)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="preparationTime">Temps de préparation (min)</Label>
                    <Input
                      id="preparationTime"
                      type="number"
                      value={formData.preparationTime}
                      onChange={(e) => setFormData({...formData, preparationTime: parseInt(e.target.value) || 15})}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="category">Catégorie</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {uniqueCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Images</Label>
                  {formData.images.map((image, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <Input
                        value={image}
                        onChange={(e) => updateImageField(index, e.target.value)}
                        placeholder="/placeholder.svg"
                        className="flex-1"
                      />
                      {formData.images.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeImageField(index)}
                        >
                          Supprimer
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addImageField}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter Image
                  </Button>
                </div>

                <div>
                  <Label htmlFor="ingredients">Ingrédients (séparés par des virgules)</Label>
                  <Textarea
                    id="ingredients"
                    value={formData.ingredients}
                    onChange={(e) => setFormData({...formData, ingredients: e.target.value})}
                    placeholder="tomate, fromage, basilic..."
                  />
                </div>

                <div>
                  <Label htmlFor="dietary">Informations diététiques (séparées par des virgules)</Label>
                  <Input
                    id="dietary"
                    value={formData.dietary}
                    onChange={(e) => setFormData({...formData, dietary: e.target.value})}
                    placeholder="végétarien, sans gluten, sans lactose..."
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) => setFormData({...formData, featured: checked})}
                    />
                    <Label htmlFor="featured">En vedette</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="available"
                      checked={formData.available}
                      onCheckedChange={(checked) => setFormData({...formData, available: checked})}
                    />
                    <Label htmlFor="available">Disponible</Label>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button type="submit" className="flex-1">
                    {editingItem ? 'Modifier l\'Article' : 'Créer l\'Article'}
                  </Button>
                  {editingItem && (
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Annuler
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Items List with Search and Filter */}
          <Card>
            <CardHeader>
              <CardTitle>Articles du Menu ({filteredMenuItems.length})</CardTitle>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher des articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrer par catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les catégories</SelectItem>
                    {uniqueCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {filteredMenuItems.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-semibold">{item.name}</h4>
                          {item.featured && (
                            <Badge variant="default" className="bg-yellow-500">
                              <Star className="w-3 h-3 mr-1" />
                              Vedette
                            </Badge>
                          )}
                          <Badge variant={item.available ? "default" : "secondary"}>
                            {item.available ? "Disponible" : "Indisponible"}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {item.description}
                        </p>
                        <div className="flex items-center space-x-3 text-sm">
                          <span className="font-bold text-orange-500">
                            {item.price.toFixed(2)}€
                          </span>
                          <span className="text-gray-500">
                            {item.category}
                          </span>
                          <span className="text-gray-500">
                            {item.preparationTime || 15} min
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-1 ml-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(item)}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {filteredMenuItems.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <ChefHat className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Aucun article trouvé</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'categories' && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Category Form */}
          <Card>
            <CardHeader>
              <CardTitle>
                {editingCategory ? 'Modifier la Catégorie' : 'Créer une Nouvelle Catégorie'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCategorySubmit} className="space-y-4">
                <div>
                  <Label htmlFor="categoryName">Nom de la catégorie</Label>
                  <Input
                    id="categoryName"
                    value={categoryFormData.name}
                    onChange={(e) => setCategoryFormData({...categoryFormData, name: e.target.value})}
                    placeholder="Ex: Pizzas, Burgers..."
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="categoryDescription">Description</Label>
                  <Textarea
                    id="categoryDescription"
                    value={categoryFormData.description}
                    onChange={(e) => setCategoryFormData({...categoryFormData, description: e.target.value})}
                    placeholder="Description de la catégorie"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="categoryImage">Image URL</Label>
                  <Input
                    id="categoryImage"
                    value={categoryFormData.image}
                    onChange={(e) => setCategoryFormData({...categoryFormData, image: e.target.value})}
                    placeholder="/placeholder.svg"
                  />
                </div>
                
                <div className="flex space-x-2">
                  <Button type="submit" className="flex-1">
                    {editingCategory ? 'Modifier la Catégorie' : 'Créer la Catégorie'}
                  </Button>
                  {editingCategory && (
                    <Button type="button" variant="outline" onClick={resetCategoryForm}>
                      Annuler
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Categories List */}
          <Card>
            <CardHeader>
              <CardTitle>Catégories ({categories.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categories.map((category) => {
                  const itemCount = menuItems.filter(item => item.category === category.name).length;
                  return (
                    <div key={category.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold mb-2">{category.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {category.description}
                          </p>
                          <p className="text-sm text-gray-500">
                            {itemCount} articles
                          </p>
                        </div>
                        <div className="flex space-x-1 ml-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditCategory(category)}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteCategory(category.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {categories.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <ChefHat className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Aucune catégorie créée</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MenuManagement;
