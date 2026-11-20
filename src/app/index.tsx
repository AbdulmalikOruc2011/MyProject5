import React, { useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type CategoryFilter = 'All' | 'Chair' | 'Table' | 'Lighting';
type ActiveTab = 'home' | 'details' | 'cart' | 'saved' | 'profile';
type DetailTab = 'Overview' | 'Material' | 'Reviews';

interface FurnitureItem {
  id: string;
  name: string;
  room: string;
  category: Exclude<CategoryFilter, 'All'>;
  price: number;
  rating: string;
  reviewsCount: string;
  subtitle: string;
  description: string;
  material: string;
  reviewSummary: string;
  image: string;
  favorite: boolean;
}

interface CartEntry {
  item: FurnitureItem;
  quantity: number;
  color: string;
}

const CATEGORIES: CategoryFilter[] = ['All', 'Chair', 'Table', 'Lighting'];
const COLORS = ['Slate Blue', 'Warm Oak', 'Espresso', 'Ivory'];

const FURNITURE_CATALOG: FurnitureItem[] = [
  {
    id: '1',
    name: 'Mondy chair',
    room: 'Office',
    category: 'Chair',
    price: 180.0,
    rating: '4.9',
    reviewsCount: '1.8k Reviews',
    subtitle: 'Ergonomic lounge seating',
    description:
      'Sculpted lounge armchair crafted with supportive cushioning and warm timber legs for calm daily seating.',
    material: 'Solid walnut wood legs, woven bouclé & high-density foam.',
    reviewSummary: 'Loved by buyers for comfort, sturdy frame, and clean studio look.',
    image:
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
    favorite: false,
  },
  {
    id: '2',
    name: 'Sofa Footstool',
    room: 'Living Room',
    category: 'Chair',
    price: 320.0,
    rating: '4.8',
    reviewsCount: '2.3k Reviews',
    subtitle: 'Free Shipping',
    description:
      'This bouclé footstool brings warmth and comfort to modern minimalist living spaces.',
    material: 'Kiln-dried hardwood frame, textured bouclé upholstery, natural ash base.',
    reviewSummary: 'Rated 4.8 stars across 2.3k reviews for soft texture and versatile height.',
    image:
      'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=800&q=80',
    favorite: false,
  },
  {
    id: '3',
    name: 'Theodore Chair',
    room: 'Dining Room',
    category: 'Chair',
    price: 423.0,
    rating: '4.7',
    reviewsCount: '940 Reviews',
    subtitle: 'Stylish + Elegance',
    description:
      'Statement accent chair with an organic silhouette designed to anchor contemporary corners.',
    material: 'Molded composite shell, brushed brass accents, soft linen blend.',
    reviewSummary: 'Praised for sculptural form and easy pairing with neutral interiors.',
    image:
      'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=800&q=80',
    favorite: false,
  },
  {
    id: '4',
    name: 'Nordic Oak Table',
    room: 'Dining Room',
    category: 'Table',
    price: 490.0,
    rating: '4.9',
    reviewsCount: '1.2k Reviews',
    subtitle: 'Hand-finished timber',
    description:
      'Minimalist low and dining table featuring rounded edges and a smooth matte natural finish.',
    material: '100% solid white oak with plant-based oil protection.',
    reviewSummary: 'Customers highlight solid weight, smooth edges, and scratch resistance.',
    image:
      'https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&w=800&q=80',
    favorite: false,
  },
  {
    id: '5',
    name: 'Halo Arc Lamp',
    room: 'Living Room',
    category: 'Lighting',
    price: 215.0,
    rating: '4.8',
    reviewsCount: '650 Reviews',
    subtitle: 'Warm ambient glow',
    description:
      'Architectural standing lamp casting a soft, glare-free halo light across reading and lounge areas.',
    material: 'Powder-coated steel stem, weighted marble base, linen diffuser.',
    reviewSummary: 'Appreciated for warm color temperature and compact footprint.',
    image:
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
    favorite: false,
  },
  {
    id: '6',
    name: 'Linen Lounge Sofa',
    room: 'Living Room',
    category: 'Chair',
    price: 640.0,
    rating: '4.9',
    reviewsCount: '1.5k Reviews',
    subtitle: 'Deep seat comfort',
    description:
      'Relaxed low-profile sofa with removable cushion covers and balanced support for everyday lounging.',
    material: 'Washed Belgian linen blend, solid oak frame, feather-wrapped foam.',
    reviewSummary: 'Highly rated for deep seats, breathable fabric, and calm appearance.',
    image:
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
    favorite: false,
  },
];

export default function FurnitureAppScreen() {
  const [items, setItems] = useState<FurnitureItem[]>(FURNITURE_CATALOG);
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [previousTab, setPreviousTab] = useState<ActiveTab>('home');
  const [selectedProductId, setSelectedProductId] = useState<string>('2');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('All');

  const [selectedColor, setSelectedColor] = useState<string>(COLORS[0]);
  const [detailQty, setDetailQty] = useState<number>(1);
  const [detailTab, setDetailTab] = useState<DetailTab>('Overview');

  const [cart, setCart] = useState<CartEntry[]>([]);
  const [promoCode, setPromoCode] = useState('');
  const [discountRate, setDiscountRate] = useState(0);

  const selectedProduct = useMemo(
    () => items.find((i) => i.id === selectedProductId) ?? items[0],
    [items, selectedProductId]
  );

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCat =
        selectedCategory === 'All' || item.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.room.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [items, selectedCategory, searchQuery]);

  const toggleFavorite = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, favorite: !item.favorite } : item
      )
    );
  };

  const openProductDetails = (product: FurnitureItem) => {
    if (activeTab !== 'details') {
      setPreviousTab(activeTab);
    }
    setSelectedProductId(product.id);
    setDetailQty(1);
    setDetailTab('Overview');
    setActiveTab('details');
  };

  const addToCart = (
    product: FurnitureItem,
    quantity: number,
    color: string,
    goToCart = false
  ) => {
    setCart((prev) => {
      const idx = prev.findIndex(
        (entry) => entry.item.id === product.id && entry.color === color
      );
      if (idx > -1) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity };
        return next;
      }
      return [...prev, { item: product, quantity, color }];
    });

    if (goToCart) {
      setActiveTab('cart');
    } else {
      Alert.alert('Added to Cart', `${product.name} (${color}) added to your cart.`);
    }
  };

  const updateCartQty = (id: string, color: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((entry) =>
          entry.item.id === id && entry.color === color
            ? { ...entry, quantity: entry.quantity + delta }
            : entry
        )
        .filter((entry) => entry.quantity > 0)
    );
  };

  const removeCartEntry = (id: string, color: string) => {
    setCart((prev) =>
      prev.filter((entry) => !(entry.item.id === id && entry.color === color))
    );
  };

  const applyPromo = () => {
    const clean = promoCode.trim().toUpperCase();
    if (!clean) {
      Alert.alert('Promocode', 'Please enter a promocode first.');
      return;
    }
    if (clean === 'HOME10' || clean === 'SAVE10') {
      setDiscountRate(0.1);
      Alert.alert('Applied', '10% discount applied to your order.');
    } else {
      setDiscountRate(0);
      Alert.alert('Invalid Code', 'Try HOME10 for a 10% discount.');
    }
  };

  const cartCount = useMemo(
    () => cart.reduce((sum, entry) => sum + entry.quantity, 0),
    [cart]
  );

  const favoriteCount = useMemo(
    () => items.filter((i) => i.favorite).length,
    [items]
  );

  const itemTotal = useMemo(
    () => cart.reduce((sum, entry) => sum + entry.item.price * entry.quantity, 0),
    [cart]
  );

  const shippingFee = useMemo(() => (cart.length > 0 ? 49.74 : 0), [cart]);

  const finalTotal = useMemo(() => {
    const discounted = itemTotal * (1 - discountRate);
    return discounted + shippingFee;
  }, [itemTotal, discountRate, shippingFee]);

  const relatedItems = useMemo(
    () => items.filter((i) => i.id !== selectedProduct?.id).slice(0, 4),
    [items, selectedProduct]
  );

  const renderBottomNav = () => (
    <View style={styles.bottomNavContainer}>
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={[
            styles.navBtn,
            (activeTab === 'home' || activeTab === 'details') && styles.navBtnActive,
          ]}
          onPress={() => setActiveTab('home')}
        >
          <Ionicons
            name={activeTab === 'home' || activeTab === 'details' ? 'home' : 'home-outline'}
            size={20}
            color={activeTab === 'home' || activeTab === 'details' ? '#ffffff' : '#5c524a'}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navBtn, activeTab === 'cart' && styles.navBtnActive]}
          onPress={() => setActiveTab('cart')}
        >
          <Ionicons
            name={activeTab === 'cart' ? 'bag-handle' : 'bag-handle-outline'}
            size={20}
            color={activeTab === 'cart' ? '#ffffff' : '#5c524a'}
          />
          {cartCount > 0 && (
            <View style={styles.badgeDot}>
              <Text style={styles.badgeDotText}>{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navBtn, activeTab === 'saved' && styles.navBtnActive]}
          onPress={() => setActiveTab('saved')}
        >
          <Ionicons
            name={activeTab === 'saved' ? 'heart' : 'heart-outline'}
            size={20}
            color={activeTab === 'saved' ? '#ffffff' : '#5c524a'}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navBtn, activeTab === 'profile' && styles.navBtnActive]}
          onPress={() => setActiveTab('profile')}
        >
          <Ionicons
            name={activeTab === 'profile' ? 'person' : 'person-outline'}
            size={20}
            color={activeTab === 'profile' ? '#ffffff' : '#5c524a'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderHomeScreen = () => (
    <ScrollView
      contentContainerStyle={styles.homeScroll}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.topRow}>
        <TouchableOpacity
          style={styles.menuBtn}
          onPress={() => {
            setSelectedCategory('All');
            setSearchQuery('');
          }}
        >
          <Ionicons name="grid" size={18} color="#2c241e" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.avatarBtn}
          onPress={() => setActiveTab('profile')}
        >
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
            }}
            style={styles.avatarImg}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.heroTitle}>Find unique furniture{'\n'}for your home</Text>

      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={20} color="#8c8075" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search furniture.."
            placeholderTextColor="#9c9085"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity
          style={styles.filterBtn}
          onPress={() => {
            const idx = CATEGORIES.indexOf(selectedCategory);
            setSelectedCategory(CATEGORIES[(idx + 1) % CATEGORIES.length]);
          }}
        >
          <Ionicons name="options-outline" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <View style={styles.promoBanner}>
        <View style={styles.promoLeft}>
          <Text style={styles.promoCaption}>Up to</Text>
          <Text style={styles.promoHighlight}>40% Discount!</Text>
          <Text style={styles.promoSub}>Limited-time furniture offers</Text>
          <TouchableOpacity
            style={styles.shopNowBtn}
            onPress={() => openProductDetails(items[2])}
          >
            <Text style={styles.shopNowText}>Shop Now</Text>
          </TouchableOpacity>
        </View>
        <Image
          source={{ uri: items[2].image }}
          style={styles.promoImage}
          resizeMode="cover"
        />
      </View>

      <View style={styles.sectionHeadingRow}>
        <Text style={styles.sectionHeading}>Popular Items</Text>
        <TouchableOpacity
          onPress={() => {
            setSelectedCategory('All');
            setSearchQuery('');
          }}
        >
          <Text style={styles.viewAllText}>View all &gt;</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={CATEGORIES}
        horizontal
        keyExtractor={(cat) => cat}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryList}
        renderItem={({ item: cat }) => {
          const active = cat === selectedCategory;
          return (
            <TouchableOpacity
              style={[styles.catChip, active && styles.catChipActive]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={[styles.catChipText, active && styles.catChipTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          );
        }}
      />

      {filteredItems.length === 0 ? (
        <View style={styles.emptyCartBox}>
          <Text style={styles.emptyCartText}>No matching furniture found.</Text>
        </View>
      ) : (
        <View style={styles.cardsGrid}>
          {filteredItems.map((product) => (
            <TouchableOpacity
              key={product.id}
              style={styles.productTile}
              onPress={() => openProductDetails(product)}
              activeOpacity={0.88}
            >
              <Image source={{ uri: product.image }} style={styles.tileImage} />

              <View style={styles.tileTopActions}>
                <TouchableOpacity
                  style={styles.heartBtn}
                  onPress={(e) => {
                    e.stopPropagation();
                    toggleFavorite(product.id);
                  }}
                >
                  <Ionicons
                    name={product.favorite ? 'heart' : 'heart-outline'}
                    size={16}
                    color={product.favorite ? '#ef4444' : '#3b322b'}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.quickAddBtn}
                  onPress={(e) => {
                    e.stopPropagation();
                    addToCart(product, 1, COLORS[0], false);
                  }}
                >
                  <Ionicons name="add" size={18} color="#ffffff" />
                </TouchableOpacity>
              </View>

              <View style={styles.tileMeta}>
                <Text style={styles.tileRoom}>{product.room}</Text>
                <Text style={styles.tileName} numberOfLines={1}>
                  {product.name}
                </Text>
                <Text style={styles.tilePrice}>${product.price.toFixed(2)}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );

  const renderDetailsScreen = () => {
    const tabCopy =
      detailTab === 'Overview'
        ? selectedProduct.description
        : detailTab === 'Material'
        ? selectedProduct.material
        : selectedProduct.reviewSummary;

    return (
      <ScrollView
        contentContainerStyle={styles.detailsScroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.detailsTopBar}>
          <TouchableOpacity
            style={styles.iconCircle}
            onPress={() => setActiveTab(previousTab)}
          >
            <Ionicons name="arrow-back" size={20} color="#2c241e" />
          </TouchableOpacity>
          <Text style={styles.screenHeaderTitle}>Product Details</Text>
          <TouchableOpacity
            style={styles.iconCircle}
            onPress={() =>
              Alert.alert(
                selectedProduct.name,
                `${selectedProduct.subtitle} — $${selectedProduct.price.toFixed(2)}`
              )
            }
          >
            <Ionicons name="ellipsis-horizontal" size={20} color="#2c241e" />
          </TouchableOpacity>
        </View>

        <View style={styles.detailHeroBox}>
          <Image
            source={{ uri: selectedProduct.image }}
            style={styles.detailHeroImage}
            resizeMode="cover"
          />
        </View>

        <View style={styles.detailInfoRow}>
          <View>
            <Text style={styles.detailTitle}>{selectedProduct.name}</Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={15} color="#b45309" />
              <Text style={styles.ratingText}>
                {selectedProduct.rating} ({selectedProduct.reviewsCount})
              </Text>
            </View>
          </View>
          <Text style={styles.detailPrice}>${selectedProduct.price.toFixed(2)}</Text>
        </View>

        <View style={styles.colorAndQtyRow}>
          <TouchableOpacity
            style={styles.colorSelector}
            onPress={() => {
              const next = COLORS[(COLORS.indexOf(selectedColor) + 1) % COLORS.length];
              setSelectedColor(next);
            }}
          >
            <View style={styles.colorDot} />
            <Text style={styles.colorLabel}>{selectedColor}</Text>
            <Ionicons name="chevron-down" size={16} color="#5c524a" />
          </TouchableOpacity>

          <View style={styles.stepperBox}>
            <TouchableOpacity
              onPress={() => setDetailQty((q) => Math.max(1, q - 1))}
              style={styles.stepperBtn}
            >
              <Text style={styles.stepperSymbol}>-</Text>
            </TouchableOpacity>
            <Text style={styles.stepperValue}>{detailQty}</Text>
            <TouchableOpacity
              onPress={() => setDetailQty((q) => q + 1)}
              style={styles.stepperBtn}
            >
              <Text style={styles.stepperSymbol}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.detailTabsRow}>
          {(['Overview', 'Material', 'Reviews'] as DetailTab[]).map((tab) => {
            const active = detailTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                style={[styles.detailTabPill, active && styles.detailTabPillActive]}
                onPress={() => setDetailTab(tab)}
              >
                <Text
                  style={[
                    styles.detailTabText,
                    active && styles.detailTabTextActive,
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.aboutHeading}>About Product</Text>
        <Text style={styles.aboutText}>{tabCopy}</Text>

        <Text style={styles.relatedHeading}>Related Items</Text>
        <View style={styles.relatedRow}>
          {relatedItems.map((rel) => (
            <TouchableOpacity
              key={rel.id}
              style={styles.relatedThumbBox}
              onPress={() => openProductDetails(rel)}
            >
              <Image source={{ uri: rel.image }} style={styles.relatedThumb} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.buyRow}>
          <TouchableOpacity
            style={styles.favSquareBtn}
            onPress={() => toggleFavorite(selectedProduct.id)}
          >
            <Ionicons
              name={selectedProduct.favorite ? 'heart' : 'heart-outline'}
              size={22}
              color={selectedProduct.favorite ? '#ef4444' : '#3b322b'}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.addDetailCartBtn}
            onPress={() => addToCart(selectedProduct, detailQty, selectedColor, false)}
          >
            <Text style={styles.addDetailCartText}>Add to Cart</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buyNowBtn}
            onPress={() => addToCart(selectedProduct, detailQty, selectedColor, true)}
          >
            <Text style={styles.buyNowText}>Buy Now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  const renderCartScreen = () => (
    <ScrollView
      contentContainerStyle={styles.cartScroll}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.detailsTopBar}>
        <TouchableOpacity
          style={styles.iconCircle}
          onPress={() => setActiveTab('home')}
        >
          <Ionicons name="arrow-back" size={20} color="#2c241e" />
        </TouchableOpacity>
        <Text style={styles.screenHeaderTitle}>My Chart</Text>
        <TouchableOpacity
          style={styles.iconCircle}
          onPress={() => setCart([])}
        >
          <Ionicons name="trash-outline" size={18} color="#2c241e" />
        </TouchableOpacity>
      </View>

      {cart.length === 0 ? (
        <View style={styles.emptyCartBox}>
          <Ionicons name="bag-handle-outline" size={40} color="#9c9085" />
          <Text style={styles.emptyCartText}>Your cart is currently empty.</Text>
          <TouchableOpacity
            style={styles.goShopBtn}
            onPress={() => setActiveTab('home')}
          >
            <Text style={styles.goShopBtnText}>Browse Furniture</Text>
          </TouchableOpacity>
        </View>
      ) : (
        cart.map((entry) => (
          <View
            key={`${entry.item.id}-${entry.color}`}
            style={styles.cartItemCard}
          >
            <Image source={{ uri: entry.item.image }} style={styles.cartItemImg} />
            <View style={styles.cartItemMiddle}>
              <Text style={styles.cartItemTitle}>{entry.item.name}</Text>
              <Text style={styles.cartItemSub}>
                {entry.item.subtitle} · {entry.color}
              </Text>
              <Text style={styles.cartItemPrice}>
                ${(entry.item.price * entry.quantity).toFixed(2)}
              </Text>
            </View>
            <View style={styles.cartItemRight}>
              <View style={styles.qtyControlGroup}>
                <TouchableOpacity
                  style={styles.qtyMiniBtn}
                  onPress={() => updateCartQty(entry.item.id, entry.color, -1)}
                >
                  <Text style={styles.qtyMiniSymbol}>-</Text>
                </TouchableOpacity>
                <Text style={styles.qtyDropdownText}>{entry.quantity}</Text>
                <TouchableOpacity
                  style={styles.qtyMiniBtn}
                  onPress={() => updateCartQty(entry.item.id, entry.color, 1)}
                >
                  <Text style={styles.qtyMiniSymbol}>+</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={() => removeCartEntry(entry.item.id, entry.color)}
                style={styles.deleteIconBtn}
              >
                <Ionicons name="trash-outline" size={18} color="#dc2626" />
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}

      <View style={styles.promoInputRow}>
        <TextInput
          style={styles.promoInput}
          placeholder="Enter promocode (try HOME10)"
          placeholderTextColor="#9c9085"
          value={promoCode}
          onChangeText={setPromoCode}
        />
        <TouchableOpacity style={styles.applyCodeBtn} onPress={applyPromo}>
          <Text style={styles.applyCodeText}>Apply code</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.amountBox}>
        <Text style={styles.amountTitle}>Amount</Text>
        <View style={styles.amountLine}>
          <Text style={styles.amountLabel}>Item total</Text>
          <Text style={styles.amountVal}>${itemTotal.toFixed(2)}</Text>
        </View>
        <View style={styles.amountLine}>
          <Text style={styles.amountLabel}>Shipping fee</Text>
          <Text style={styles.amountVal}>${shippingFee.toFixed(2)}</Text>
        </View>
        <View style={styles.amountLine}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalVal}>${finalTotal.toFixed(2)}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.checkoutBtn}
        onPress={() => {
          if (cart.length === 0) {
            Alert.alert('Cart Empty', 'Add furniture items before checkout.');
            return;
          }
          Alert.alert(
            'Order Confirmed',
            `Total charged: $${finalTotal.toFixed(2)}. Thank you!`
          );
        }}
      >
        <Text style={styles.checkoutBtnText}>Proceed to Checkout</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderSavedScreen = () => {
    const favorites = items.filter((i) => i.favorite);
    return (
      <ScrollView
        contentContainerStyle={styles.cartScroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.detailsTopBar}>
          <TouchableOpacity
            style={styles.iconCircle}
            onPress={() => setActiveTab('home')}
          >
            <Ionicons name="arrow-back" size={20} color="#2c241e" />
          </TouchableOpacity>
          <Text style={styles.screenHeaderTitle}>Saved Items</Text>
          <View style={styles.iconPlaceholder} />
        </View>

        {favorites.length === 0 ? (
          <View style={styles.emptyCartBox}>
            <Ionicons name="heart-outline" size={40} color="#9c9085" />
            <Text style={styles.emptyCartText}>
              No saved items yet. Tap the heart icon on any furniture item.
            </Text>
          </View>
        ) : (
          favorites.map((fav) => (
            <TouchableOpacity
              key={fav.id}
              style={styles.cartItemCard}
              onPress={() => openProductDetails(fav)}
            >
              <Image source={{ uri: fav.image }} style={styles.cartItemImg} />
              <View style={styles.cartItemMiddle}>
                <Text style={styles.cartItemTitle}>{fav.name}</Text>
                <Text style={styles.cartItemSub}>{fav.room}</Text>
                <Text style={styles.cartItemPrice}>${fav.price.toFixed(2)}</Text>
              </View>
              <View style={styles.savedActionsRow}>
                <TouchableOpacity
                  style={styles.removeFavBtn}
                  onPress={(e) => {
                    e.stopPropagation();
                    toggleFavorite(fav.id);
                  }}
                >
                  <Ionicons name="heart-dislike-outline" size={18} color="#dc2626" />
                  <Text style={styles.removeFavText}>Remove</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.quickAddBtn}
                  onPress={(e) => {
                    e.stopPropagation();
                    addToCart(fav, 1, COLORS[0], false);
                  }}
                >
                  <Ionicons name="add" size={18} color="#ffffff" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    );
  };

  const renderProfileScreen = () => (
    <ScrollView
      contentContainerStyle={styles.cartScroll}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.detailsTopBar}>
        <TouchableOpacity
          style={styles.iconCircle}
          onPress={() => setActiveTab('home')}
        >
          <Ionicons name="arrow-back" size={20} color="#2c241e" />
        </TouchableOpacity>
        <Text style={styles.screenHeaderTitle}>Profile</Text>
        <View style={styles.iconPlaceholder} />
      </View>

      <View style={styles.profileCard}>
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          }}
          style={styles.profileAvatarLarge}
        />
        <Text style={styles.profileName}>Elena Rostova</Text>
        <Text style={styles.profileSub}>Home Interior Member · Warm Earth Studio</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{favoriteCount}</Text>
          <Text style={styles.statLabel}>Saved</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{cartCount}</Text>
          <Text style={styles.statLabel}>In Cart</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>${itemTotal.toFixed(0)}</Text>
          <Text style={styles.statLabel}>Subtotal</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.profileActionRow}
        onPress={() => setActiveTab('saved')}
      >
        <View style={styles.profileActionLeft}>
          <Ionicons name="heart-outline" size={20} color="#8d5b3e" />
          <Text style={styles.profileActionText}>Saved Furniture ({favoriteCount})</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#8c8075" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.profileActionRow}
        onPress={() => setActiveTab('cart')}
      >
        <View style={styles.profileActionLeft}>
          <Ionicons name="bag-handle-outline" size={20} color="#8d5b3e" />
          <Text style={styles.profileActionText}>Open Cart ({cartCount} items)</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#8c8075" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.profileActionRow}
        onPress={() => {
          setCart([]);
          setDiscountRate(0);
          Alert.alert('Cleared', 'Cart and promo discount have been reset.');
        }}
      >
        <View style={styles.profileActionLeft}>
          <Ionicons name="refresh-outline" size={20} color="#dc2626" />
          <Text style={[styles.profileActionText, { color: '#dc2626' }]}>
            Reset Cart & Promo
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#8c8075" />
      </TouchableOpacity>
    </ScrollView>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.root}
    >
      <StatusBar barStyle="dark-content" />
      <View style={styles.phoneFrame}>
        {activeTab === 'home' && renderHomeScreen()}
        {activeTab === 'details' && renderDetailsScreen()}
        {activeTab === 'cart' && renderCartScreen()}
        {activeTab === 'saved' && renderSavedScreen()}
        {activeTab === 'profile' && renderProfileScreen()}
        {renderBottomNav()}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#d6cfc7',
    alignItems: 'center',
  },
  phoneFrame: {
    flex: 1,
    width: '100%',
    maxWidth: 460,
    backgroundColor: '#f8f6f3',
  },
  homeScroll: {
    paddingTop: 28,
    paddingHorizontal: 20,
    paddingBottom: 110,
  },
  detailsScroll: {
    paddingTop: 28,
    paddingHorizontal: 20,
    paddingBottom: 110,
  },
  cartScroll: {
    paddingTop: 28,
    paddingHorizontal: 20,
    paddingBottom: 110,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  menuBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#efece7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    overflow: 'hidden',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2c241e',
    lineHeight: 35,
    marginBottom: 18,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 18,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: '#ebe6df',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#2c241e',
  },
  filterBtn: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#8d5b3e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  promoBanner: {
    flexDirection: 'row',
    backgroundColor: '#1d1c1b',
    borderRadius: 20,
    padding: 18,
    marginBottom: 22,
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  promoLeft: {
    flex: 1,
    paddingRight: 10,
  },
  promoCaption: {
    color: '#d6cfc7',
    fontSize: 13,
  },
  promoHighlight: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '800',
    marginTop: 2,
  },
  promoSub: {
    color: '#b8b0a6',
    fontSize: 12,
    marginTop: 4,
    marginBottom: 14,
  },
  shopNowBtn: {
    alignSelf: 'flex-start',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  shopNowText: {
    color: '#1d1c1b',
    fontWeight: '700',
    fontSize: 12,
  },
  promoImage: {
    width: 122,
    height: 122,
    borderRadius: 16,
  },
  sectionHeadingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c241e',
  },
  viewAllText: {
    fontSize: 12,
    color: '#8c8075',
    fontWeight: '600',
  },
  categoryList: {
    gap: 10,
    paddingBottom: 16,
  },
  catChip: {
    paddingHorizontal: 20,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ebe6df',
  },
  catChipActive: {
    backgroundColor: '#8d5b3e',
    borderColor: '#8d5b3e',
  },
  catChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5c524a',
  },
  catChipTextActive: {
    color: '#ffffff',
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 14,
  },
  productTile: {
    width: '47.5%',
    height: 196,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#e7e1d8',
  },
  tileImage: {
    width: '100%',
    height: '100%',
  },
  tileTopActions: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tileMeta: {
    position: 'absolute',
    left: 10,
    right: 10,
    bottom: 10,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 10,
  },
  tileRoom: {
    fontSize: 10,
    color: '#7c7268',
  },
  tileName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2c241e',
  },
  tilePrice: {
    fontSize: 12,
    fontWeight: '800',
    color: '#8d5b3e',
    marginTop: 1,
  },
  heartBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.92)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickAddBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#8d5b3e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  savedActionsRow: {
    alignItems: 'flex-end',
    gap: 8,
  },
  removeFavBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#fef2f2',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  removeFavText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#dc2626',
  },
  detailsTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#efece7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconPlaceholder: {
    width: 38,
    height: 38,
  },
  screenHeaderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c241e',
  },
  detailHeroBox: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: 12,
    alignItems: 'center',
    marginBottom: 18,
  },
  detailHeroImage: {
    width: '100%',
    height: 220,
    borderRadius: 16,
  },
  detailInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  detailTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2c241e',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 4,
  },
  ratingText: {
    fontSize: 13,
    color: '#6e645b',
  },
  detailPrice: {
    fontSize: 22,
    fontWeight: '800',
    color: '#2c241e',
  },
  colorAndQtyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  colorSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e7e1d8',
  },
  colorDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#8d5b3e',
  },
  colorLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2c241e',
  },
  stepperBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e7e1d8',
  },
  stepperBtn: {
    paddingHorizontal: 4,
  },
  stepperSymbol: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2c241e',
  },
  stepperValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2c241e',
  },
  detailTabsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 18,
  },
  detailTabPill: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ebe6df',
  },
  detailTabPillActive: {
    backgroundColor: '#2c241e',
    borderColor: '#2c241e',
  },
  detailTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5c524a',
  },
  detailTabTextActive: {
    color: '#ffffff',
  },
  aboutHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2c241e',
    marginBottom: 6,
  },
  aboutText: {
    fontSize: 13,
    color: '#6e645b',
    lineHeight: 20,
    marginBottom: 18,
  },
  relatedHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2c241e',
    marginBottom: 10,
  },
  relatedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 22,
  },
  relatedThumbBox: {
    flex: 1,
    height: 64,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
  },
  relatedThumb: {
    width: '100%',
    height: '100%',
  },
  buyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  favSquareBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ebe6df',
  },
  addDetailCartBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#8d5b3e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addDetailCartText: {
    color: '#8d5b3e',
    fontSize: 14,
    fontWeight: '700',
  },
  buyNowBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#8d5b3e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buyNowText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  cartItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 12,
    marginBottom: 12,
    gap: 12,
  },
  cartItemImg: {
    width: 68,
    height: 68,
    borderRadius: 14,
    backgroundColor: '#f3efe9',
  },
  cartItemMiddle: {
    flex: 1,
  },
  cartItemTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2c241e',
  },
  cartItemSub: {
    fontSize: 12,
    color: '#7c7268',
    marginTop: 2,
  },
  cartItemPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: '#2c241e',
    marginTop: 6,
  },
  cartItemRight: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 10,
  },
  qtyControlGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f8f6f3',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e7e1d8',
  },
  qtyMiniBtn: {
    paddingHorizontal: 4,
  },
  qtyMiniSymbol: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2c241e',
  },
  qtyDropdownText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2c241e',
  },
  deleteIconBtn: {
    padding: 4,
  },
  promoInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    paddingLeft: 14,
    paddingRight: 6,
    paddingVertical: 6,
    marginTop: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ebe6df',
  },
  promoInput: {
    flex: 1,
    fontSize: 14,
    color: '#2c241e',
  },
  applyCodeBtn: {
    backgroundColor: '#8d5b3e',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  applyCodeText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 13,
  },
  amountBox: {
    marginBottom: 20,
    gap: 8,
  },
  amountTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2c241e',
    marginBottom: 4,
  },
  amountLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: 13,
    color: '#6e645b',
  },
  amountVal: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2c241e',
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2c241e',
  },
  totalVal: {
    fontSize: 16,
    fontWeight: '800',
    color: '#2c241e',
  },
  checkoutBtn: {
    backgroundColor: '#8d5b3e',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  checkoutBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  emptyCartBox: {
    paddingVertical: 40,
    alignItems: 'center',
    gap: 10,
  },
  emptyCartText: {
    color: '#7c7268',
    fontSize: 14,
    textAlign: 'center',
  },
  goShopBtn: {
    marginTop: 6,
    backgroundColor: '#8d5b3e',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
  },
  goShopBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 13,
  },
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ebe6df',
  },
  profileAvatarLarge: {
    width: 76,
    height: 76,
    borderRadius: 38,
    marginBottom: 12,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c241e',
  },
  profileSub: {
    fontSize: 12,
    color: '#7c7268',
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ebe6df',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: '#8d5b3e',
  },
  statLabel: {
    fontSize: 12,
    color: '#7c7268',
    marginTop: 2,
  },
  profileActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ebe6df',
  },
  profileActionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profileActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c241e',
  },
  bottomNavContainer: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 18,
    alignItems: 'center',
  },
  bottomNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: '#efeae3',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#e2dbd2',
  },
  navBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navBtnActive: {
    backgroundColor: '#1d1c1b',
  },
  badgeDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#8d5b3e',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  badgeDotText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
  },
});