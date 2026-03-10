
package net.webservicex.client;

import java.io.Serializable;
import javax.annotation.Generated;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;


/**
 * <p>Java class for anonymous complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType>
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="GetGeoIPContextResult" type="{http://www.webservicex.net/}GeoIP" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "", propOrder = {
    "getGeoIPContextResult"
})
@XmlRootElement(name = "GetGeoIPContextResponse")
@Generated(value = "com.sun.tools.xjc.Driver", date = "2018-11-13T12:15:52+01:00", comments = "JAXB RI v2.2.11")
public class GetGeoIPContextResponse
    implements Serializable
{

    @Generated(value = "com.sun.tools.xjc.Driver", date = "2018-11-13T12:15:52+01:00", comments = "JAXB RI v2.2.11")
    private final static long serialVersionUID = 1L;
    @XmlElement(name = "GetGeoIPContextResult")
    @Generated(value = "com.sun.tools.xjc.Driver", date = "2018-11-13T12:15:52+01:00", comments = "JAXB RI v2.2.11")
    protected GeoIP getGeoIPContextResult;

    /**
     * Gets the value of the getGeoIPContextResult property.
     * 
     * @return
     *     possible object is
     *     {@link GeoIP }
     *     
     */
    @Generated(value = "com.sun.tools.xjc.Driver", date = "2018-11-13T12:15:52+01:00", comments = "JAXB RI v2.2.11")
    public GeoIP getGetGeoIPContextResult() {
        return getGeoIPContextResult;
    }

    /**
     * Sets the value of the getGeoIPContextResult property.
     * 
     * @param value
     *     allowed object is
     *     {@link GeoIP }
     *     
     */
    @Generated(value = "com.sun.tools.xjc.Driver", date = "2018-11-13T12:15:52+01:00", comments = "JAXB RI v2.2.11")
    public void setGetGeoIPContextResult(GeoIP value) {
        this.getGeoIPContextResult = value;
    }

    @Override
    @Generated(value = "com.sun.tools.xjc.Driver", date = "2018-11-13T12:15:52+01:00", comments = "JAXB RI v2.2.11")
    public String toString() {
        return ToStringBuilder.reflectionToString(this, ToStringStyle.SHORT_PREFIX_STYLE);
    }

    @Override
    @Generated(value = "com.sun.tools.xjc.Driver", date = "2018-11-13T12:15:52+01:00", comments = "JAXB RI v2.2.11")
    public boolean equals(Object that) {
        return EqualsBuilder.reflectionEquals(this, that);
    }

    @Override
    @Generated(value = "com.sun.tools.xjc.Driver", date = "2018-11-13T12:15:52+01:00", comments = "JAXB RI v2.2.11")
    public int hashCode() {
        return HashCodeBuilder.reflectionHashCode(this);
    }

}
